"use client";

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { UploadCloud, FileVideo, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface UploadVideoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUploadSuccess: (fileName: string) => void;
}

export function UploadVideoDialog({ isOpen, onOpenChange, onUploadSuccess }: UploadVideoDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const baseURL = "https://699vtecaf8.execute-api.us-west-2.amazonaws.com/admin-api"
  const defaultAxios = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith('video/mp4')) {
        toast({
            variant: "destructive",
            title: "Arquivo inválido",
            description: "Por favor, selecione um arquivo de vídeo mp4.",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    console.log("Iniciando upload...");
    console.log("Selected file:", selectedFile);
    if (!selectedFile) return;
    setIsUploading(true);
    
    const { size, type } = selectedFile;

    if (type !== 'video/mp4') {
        toast({
            variant: "destructive",
            title: "Formato inválido",
            description: "Apenas arquivos MP4 são suportados.",
        });
        setIsUploading(false);
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token não encontrado. Usuário não autenticado.");
        toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Você precisa estar logado para fazer upload.",
        });
        setIsUploading(false);
        onOpenChange(false);
        return;
    }

    try {
      const fileType = type.split('/')[1]; // extrai o tipo de vídeo, ex: 'mp4'
      const presignedUrlResponse = await defaultAxios.get('/v1/uploads/presigned-url',
        {
          params: {
            contentLength: size,
            fileType,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      const presignedUrl = presignedUrlResponse.data.url;
      if (!presignedUrl) {
        console.error("URL pré-assinada não recebida do servidor.");
        throw new Error("URL pré-assinada não recebida do servidor.");
      }

      await axios.put(presignedUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type, // exemplo: 'video/mp4'
        },
      });
    }
    catch (error) {
        console.error("Erro ao fazer upload:", error);
        toast({
            variant: "destructive",
            title: "Erro ao fazer upload",
            description: "Ocorreu um erro ao tentar enviar o vídeo. Por favor, tente novamente.",
        });
        setIsUploading(false);
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Uploading file:", selectedFile.name);
    onUploadSuccess(selectedFile.name);
    
    toast({
        title: "Upload Concluído!",
        description: `O vídeo "${selectedFile.name}" está sendo processado.`,
    });

    setIsUploading(false);
    setSelectedFile(null);
    onOpenChange(false);
  };

  const closeDialog = () => {
    if(isUploading) return;
    setSelectedFile(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px] bg-card gradient-border rounded-lg">
        <div className='bg-card rounded-md p-6'>
            <DialogHeader>
                <DialogTitle>Fazer Upload de Vídeo</DialogTitle>
                <DialogDescription>Selecione um arquivo de vídeo do seu computador para enviar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div
                    className="flex items-center justify-center w-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            setSelectedFile(e.dataTransfer.files[0]);
                        }
                    }}
                >
                    <Label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/30 hover:border-primary transition-colors"
                    >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-primary" />
                        <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">Qualquer formato de vídeo</p>
                    </div>
                    <Input id="video-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="video/*" disabled={isUploading} />
                    </Label>
                </div>
                {selectedFile && (
                    <div className="flex items-center p-2 mt-2 rounded-md bg-muted/50 text-sm">
                        <FileVideo className="w-5 h-5 mr-2 text-accent" />
                        <span className="font-code truncate">{selectedFile.name}</span>
                    </div>
                )}
                </div>
            <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isUploading}>Cancelar</Button>
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="gradient-button">
                {isUploading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : <><UploadCloud className="mr-2 h-4 w-4" /> Fazer Upload</>}
            </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
