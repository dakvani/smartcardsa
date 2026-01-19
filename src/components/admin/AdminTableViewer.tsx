import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type TableName = "profiles" | "nfc_orders" | "product_reviews" | "product_wishlist" | 
                 "profile_views" | "email_subscribers" | "links" | "link_groups" | 
                 "link_clicks" | "profile_templates" | "user_roles" | "user_theme_presets" | "nfc_product_drafts";

interface TableInfo {
  name: TableName;
  label: string;
  description: string;
  canDelete: boolean;
}

const TABLES: TableInfo[] = [
  { name: "profiles", label: "Profiles", description: "User profile data", canDelete: false },
  { name: "nfc_orders", label: "NFC Orders", description: "Product orders", canDelete: true },
  { name: "product_reviews", label: "Product Reviews", description: "User reviews", canDelete: true },
  { name: "product_wishlist", label: "Wishlist", description: "Saved products", canDelete: true },
  { name: "profile_views", label: "Profile Views", description: "View analytics", canDelete: true },
  { name: "email_subscribers", label: "Email Subscribers", description: "Newsletter signups", canDelete: true },
  { name: "links", label: "Links", description: "User links", canDelete: true },
  { name: "link_groups", label: "Link Groups", description: "Link categories", canDelete: true },
  { name: "link_clicks", label: "Link Clicks", description: "Click analytics", canDelete: true },
  { name: "profile_templates", label: "Templates", description: "Profile templates", canDelete: false },
  { name: "user_roles", label: "User Roles", description: "Role assignments", canDelete: true },
  { name: "user_theme_presets", label: "Theme Presets", description: "Custom themes", canDelete: true },
  { name: "nfc_product_drafts", label: "Product Drafts", description: "Design drafts", canDelete: true },
];

export function AdminTableViewer() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<TableName>("profiles");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ table: TableName; id: string } | null>(null);

  useEffect(() => {
    loadTableData();
  }, [selectedTable]);

  const loadTableData = async () => {
    setLoading(true);
    try {
      let query = supabase.from(selectedTable).select("*").limit(100);
      
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === "asc" });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data: result, error } = await query;

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error("Error loading table data:", error);
      toast({
        title: "Error",
        description: `Failed to load data from ${selectedTable}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  useEffect(() => {
    if (sortColumn) {
      loadTableData();
    }
  }, [sortColumn, sortDirection]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from(deleteConfirm.table)
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;

      setData(data.filter(row => row.id !== deleteConfirm.id));
      toast({
        title: "Deleted",
        description: "Record deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: "Failed to delete record.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const currentTableInfo = TABLES.find(t => t.name === selectedTable);

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value).substring(0, 50) + "...";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    const strValue = String(value);
    return strValue.length > 50 ? strValue.substring(0, 50) + "..." : strValue;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>View and manage database records</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedTable} onValueChange={(v) => setSelectedTable(v as TableName)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TABLES.map(table => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={loadTableData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No records found
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.slice(0, 6).map(column => (
                      <TableHead
                        key={column}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-1">
                          {column.replace(/_/g, " ")}
                          {sortColumn === column && (
                            sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredData.map((row, index) => (
                      <motion.tr
                        key={String(row.id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b"
                      >
                        {columns.slice(0, 6).map(column => (
                          <TableCell key={column} className="font-mono text-sm">
                            {formatCellValue(row[column])}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRow(row)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {currentTableInfo?.canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteConfirm({ table: selectedTable, id: String(row.id) })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredData.length} of {data.length} records (max 100)</span>
          <Badge variant="outline">{currentTableInfo?.description}</Badge>
        </div>
      </CardContent>

      {/* View Record Dialog */}
      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
            <DialogDescription>Full record data from {selectedTable}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(selectedRow, null, 2)}
            </pre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRow(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
