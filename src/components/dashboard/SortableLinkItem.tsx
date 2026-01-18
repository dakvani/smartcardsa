import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Eye, EyeOff, Trash2, BarChart3 } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  visible: boolean;
  click_count: number;
}

interface SortableLinkItemProps {
  link: LinkItem;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
}

export function SortableLinkItem({ link, onUpdate, onDelete }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className="p-4 bg-secondary/50 rounded-xl border border-border"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 space-y-3">
          <input
            value={link.title}
            onChange={(e) => onUpdate(link.id, { title: e.target.value })}
            onBlur={(e) => onUpdate(link.id, { title: e.target.value })}
            placeholder="Link Title"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium"
          />
          <input
            value={link.url}
            onChange={(e) => onUpdate(link.id, { url: e.target.value })}
            onBlur={(e) => onUpdate(link.id, { url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="w-3 h-3" />
            <span>{link.click_count} clicks</span>
          </div>
        </div>
        <button
          onClick={() => onUpdate(link.id, { visible: !link.visible })}
          className="p-2 hover:bg-secondary rounded-lg"
          title={link.visible ? "Hide link" : "Show link"}
        >
          {link.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
