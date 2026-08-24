import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"
import { toast } from "sonner"

export interface DocumentCardProps {
  id: string
  name: string
  category: string
  size: string
  date: string
  onDownload?: () => void
}

export function DocumentCard({
  name,
  category,
  size,
  date,
  onDownload,
}: DocumentCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload()
    } else {
      toast.success("Downloading document", {
        description: `${name} (${size}) is saving to your downloads.`,
      })
    }
  }

  const handlePreview = () => {
    toast.info("Opening Document Viewer", {
      description: `Viewing encrypted digital copy of ${name}.`,
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                {name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                  {category}
                </Badge>
                <span>•</span>
                <span>{size}</span>
                <span>•</span>
                <span>{date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreview}
              title="Preview"
              className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Download"
              className="size-8 text-primary border-primary/30 hover:bg-primary/10 cursor-pointer"
            >
              <Download className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
