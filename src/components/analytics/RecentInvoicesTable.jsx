import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

export default function RecentInvoicesTable({ invoices, projects }) {
  const getInvoiceStatus = (invoice) => {
    if (invoice.status === 'paid') return 'paid';
    if (invoice.status === 'cancelled') return 'cancelled';
    
    const dueDate = new Date(invoice.due_date);
    const today = new Date();
    
    if (dueDate < today) return 'overdue';
    return invoice.status;
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.project_name || 'Unknown Project';
  };

  const recentInvoices = invoices.slice(0, 10);

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Invoice #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No invoices yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                recentInvoices.map((invoice) => {
                  const displayStatus = getInvoiceStatus(invoice);
                  
                  return (
                    <TableRow key={invoice.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {getProjectName(invoice.project_id)}
                      </TableCell>
                      <TableCell className="font-bold text-[#1e3a5f]">
                        ${invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[displayStatus]} capitalize`}>
                          {displayStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}