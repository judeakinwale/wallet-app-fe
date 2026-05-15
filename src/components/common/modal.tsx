import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type ModalProps = {
  title: string;
  description?: string;
  trigger?: React.ReactElement;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  footerCancelBtn?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
};

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  trigger,
  body,
  footer,
  footerCancelBtn,
  open,
  onOpenChange,
  contentClassName,
}) => {
  footerCancelBtn ||= <Button variant="outline">Cancel</Button>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {body}
        {footer && (
          <DialogFooter>
            {footerCancelBtn && (
              <DialogClose asChild>{footerCancelBtn}</DialogClose>
            )}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
