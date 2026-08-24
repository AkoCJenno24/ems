import { useState } from "react"
import { useEMSStore } from "@/store/use-ems-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Plus,
  CheckCircle2,
  BookOpen,
  LifeBuoy,
  X,
} from "lucide-react"
import { toast } from "sonner"

export function EmployeeHelpdeskPage() {
  const { tickets, submitTicket, currentUser } = useEMSStore()
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    title: "",
    category: "Payroll & Compensation" as const,
    priority: "Medium" as const,
    description: "",
  })

  // Filter tickets submitted by current user or relevant
  const myTickets = tickets.filter(
    (t) =>
      t.submittedBy === currentUser.name ||
      t.submittedBy === "Alex Morgan" ||
      t.department === currentUser.department
  )

  const faqs = [
    {
      q: "When is monthly payroll processed and disbursed?",
      a: "Payroll is calculated on the 23rd of every month and disbursed via direct ACH deposit on the 25th (or preceding business day if on a weekend).",
    },
    {
      q: "How do I request an ergonomic chair or second monitor?",
      a: "Submit an IT & Hardware ticket through this helpdesk specifying your home or office desk location. Approvals are typically completed within 24 hours.",
    },
    {
      q: "What is the annual leave rollover policy?",
      a: "Up to 5 unused annual leave days can be carried over to the next calendar year. Carried over days must be utilized before March 31st.",
    },
  ]

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketForm.title.trim() || !ticketForm.description.trim()) {
      toast.error("Please provide a title and detailed description.")
      return
    }

    submitTicket({
      title: ticketForm.title,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: "Open",
      submittedBy: currentUser.name,
      department: currentUser.department,
      assignee: "HR / IT Helpdesk",
      description: ticketForm.description,
    })

    toast.success("Helpdesk Ticket Logged", {
      description: "Your inquiry has been assigned to support and an agent will respond shortly.",
    })
    setShowSubmitModal(false)
    setTicketForm({
      title: "",
      category: "Payroll & Compensation",
      priority: "Medium",
      description: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Employee Helpdesk & Support
          </h1>
          <p className="text-sm text-muted-foreground">
            Submit questions to HR, IT, and Payroll, and browse employee knowledge guides
          </p>
        </div>
        <Button
          onClick={() => setShowSubmitModal(true)}
          className="gap-1.5 font-semibold text-xs shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          Raise Support Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Active Tickets */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <LifeBuoy className="size-4 text-primary" />
                My Inquiries & Support Tickets
              </CardTitle>
              <CardDescription className="text-xs">
                Track status and responses from corporate support teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 py-10 text-center">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    No active support inquiries
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All your previous tickets have been resolved.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col gap-2.5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {ticket.id}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              ticket.status === "Resolved"
                                ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-[10px]"
                                : ticket.status === "In Review"
                                ? "border-amber-500/30 text-amber-600 bg-amber-500/10 text-[10px]"
                                : "border-blue-500/30 text-blue-600 bg-blue-500/10 text-[10px]"
                            }
                          >
                            {ticket.status}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {ticket.priority} Priority
                          </Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {ticket.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </p>
                      </div>

                      <div className="text-left sm:text-right text-xs text-muted-foreground shrink-0">
                        <div>Assignee: <strong className="text-foreground">{ticket.assignee}</strong></div>
                        <div>{ticket.submittedAt} • {ticket.responses} replies</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Knowledge Base FAQs */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="size-4 text-purple-500" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border/70 p-3 bg-muted/20 space-y-1">
                  <div className="font-semibold text-foreground">{faq.q}</div>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Raise Ticket Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <Card className="w-full max-w-md shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Submit Support Ticket
                </CardTitle>
                <CardDescription className="text-xs">
                  Direct your request to HR, IT, or Payroll administrators
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSubmitModal(false)}
                className="size-7 cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </CardHeader>
            <form onSubmit={handleTicketSubmit}>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="tck-title" className="text-xs">Subject / Title</Label>
                  <Input
                    id="tck-title"
                    placeholder="e.g. Inquire about health insurance coverage for dependent"
                    value={ticketForm.title}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="tck-cat" className="text-xs">Category</Label>
                    <select
                      id="tck-cat"
                      value={ticketForm.category}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none"
                    >
                      <option value="Payroll & Compensation">Payroll & Compensation</option>
                      <option value="Benefits & Insurance">Benefits & Insurance</option>
                      <option value="IT & Hardware">IT & Hardware</option>
                      <option value="Workplace & Facilities">Workplace & Facilities</option>
                      <option value="HR Policies">HR Policies</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tck-priority" className="text-xs">Priority</Label>
                    <select
                      id="tck-priority"
                      value={ticketForm.priority}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          priority: e.target.value as any,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tck-desc" className="text-xs">Detailed Description</Label>
                  <textarea
                    id="tck-desc"
                    rows={4}
                    value={ticketForm.description}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Provide context, screenshots, or specific questions..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none"
                  />
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-semibold cursor-pointer">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
