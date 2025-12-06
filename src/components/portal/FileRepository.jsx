import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { FileText, Download, Upload, Loader2, Image, FileCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const documentTypeConfig = {
  contract: { color: 'bg-blue-100 text-blue-700', icon: FileCheck, label: 'Contract' },
  invoice: { color: 'bg-green-100 text-green-700', icon: FileText, label: 'Invoice' },
  photo: { color: 'bg-purple-100 text-purple-700', icon: Image, label: 'Photo' },
  permit: { color: 'bg-yellow-100 text-yellow-700', icon: FileText, label: 'Permit' },
  warranty: { color: 'bg-emerald-100 text-emerald-700', icon: FileCheck, label: 'Warranty' },
  insurance_claim: { color: 'bg-orange-100 text-orange-700', icon: FileText, label: 'Insurance Claim' },
  property_plan: { color: 'bg-cyan-100 text-cyan-700', icon: FileText, label: 'Property Plan' },
  other: { color: 'bg-slate-100 text-slate-700', icon: FileText, label: 'Other' },
};

export default function FileRepository({ project, isClientView = false }) {
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('other');
  const [documentDescription, setDocumentDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', project.id],
    queryFn: async () => {
      const allDocs = await base44.entities.Document.list('-created_date');
      return allDocs.filter(d => d.project_id === project.id);
    },
    initialData: [],
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      
      return base44.entities.Document.create({
        project_id: project.id,
        document_name: selectedFile.name,
        document_type: documentType,
        file_url,
        file_size: selectedFile.size,
        description: documentDescription || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', project.id] });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocumentType('other');
      setDocumentDescription('');
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await uploadMutation.mutateAsync();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setDocumentType('other');
    setDocumentDescription('');
  };

  return (
    <>
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-[#1e3a5f]">
              Documents & Files
            </CardTitle>
            <label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                as="span"
                size="sm"
                className="bg-[#10b981] hover:bg-[#059669] cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isClientView ? 'Upload Document' : 'Upload'}
              </Button>
            </label>
          </div>
          {isClientView && (
            <p className="text-sm text-slate-600 mt-2">
              Upload requested documents like insurance claims, property plans, or photos
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No documents yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {documents.map((doc) => {
                const config = documentTypeConfig[doc.document_type] || documentTypeConfig.other;
                const DocIcon = config.icon;
                
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`${config.color} p-2 rounded-lg`}>
                        <DocIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">
                          {doc.document_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={`${config.color} border text-xs`}>
                            {config.label}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {format(new Date(doc.created_date), 'MMM d, yyyy')}
                          </span>
                          {doc.description && (
                            <span className="text-xs text-slate-600 italic truncate">
                              {doc.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3"
                    >
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Select the type of document you're uploading and add any relevant details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedFile && (
              <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 truncate">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="document_type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document_type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(documentTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="document_description">Description (Optional)</Label>
              <Input
                id="document_description"
                placeholder="Add a description..."
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="flex-1 bg-[#10b981] hover:bg-[#059669]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}