import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { CircleHelp } from "lucide-react";

interface IHelperDialog {
    title: string;
    children: React.ReactNode;
}

const HelperDialog = ({ children, title }: IHelperDialog) => {

    return (
        <Dialog>
            <DialogTrigger>
                <CircleHelp className="hover:scale-110 transition-all text-black" />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                    <DialogDescription>
                        {children}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default HelperDialog