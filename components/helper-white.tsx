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

const HelperDialogWhite = ({ children, title }: IHelperDialog) => {

    return (
        <Dialog>
            <DialogTrigger>
                <CircleHelp color="white"></CircleHelp>


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

export default HelperDialogWhite