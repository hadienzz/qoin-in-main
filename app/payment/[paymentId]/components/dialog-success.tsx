import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface DialogSuccessProps {
  showArrivedDialog: boolean;
  setShowArrivedDialog: (value: boolean) => void;
  merchantName?: string;
  handleSuccess: () => void;
  isPending: boolean;
}
const DialogSuccess = ({
  showArrivedDialog,
  setShowArrivedDialog,
  merchantName,
  handleSuccess,
}: DialogSuccessProps) => {
  const router = useRouter();

  return (
    <Dialog open={showArrivedDialog} onOpenChange={setShowArrivedDialog}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333] md:text-2xl">
            Pesanan kamu sudah sampai! 🎉
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-[#8D8D8D] md:text-base">
            Terima kasih sudah berbelanja dengan Qoin. Semoga kamu puas dengan
            pesanan dan pelayanannya. Jangan lupa beri rating dan ulasan untuk
            mendukung UMKM favoritmu.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
          <button
            className="bg-primary hover:bg-primary/90 w-full rounded-full py-3 text-sm font-semibold text-white transition-colors duration-200 md:py-3.5 md:text-base"
            onClick={() => {
              setShowArrivedDialog(false);
              router.push(`/payment/${merchantName}/rating`);
            }}
          >
            Beri Rating & Ulasan
          </button>
          <button
            className="hover:border-primary hover:text-primary w-full rounded-full border-2 border-[#E5E7EB] py-3 text-sm font-semibold text-[#333] transition-colors duration-200 md:py-3.5 md:text-base"
            onClick={
              handleSuccess
              // setShowArrivedDialog(false);
              // router.push("/");
            }
          >
            Lewati
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSuccess;
