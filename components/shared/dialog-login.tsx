"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import BorderButton from "./border-button";
import GoogleIcon from "../icons/google";
import Mail from "../icons/mail";

interface DialogLoginProps {
  open: boolean;
  onClose: () => void;
  openModal: (open: string) => void;
}

const DialogLogin = ({ open, onClose, openModal }: DialogLoginProps) => {
  const handleClick = () => {
    alert(
      "Fitur ini masih dalam pengembangan. Silahkan login menggunakan email",
    );
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="z-1000">
        <DialogHeader>
          <Image
            src={"/logo.svg"}
            width={96}
            height={96}
            alt="Logo"
            className="mx-auto"
          />
          <DialogTitle className="text-secondary text-center text-base font-bold lg:text-3xl">
            Masuk dulu yuk, biar bisa dukung UMKM favoritmu
          </DialogTitle>
        </DialogHeader>
        <BorderButton
          className="md:text-md mx-auto w-70 text-sm lg:w-100"
          icon={<GoogleIcon />}
          onClick={handleClick}
        >
          Lanjut dengan google
        </BorderButton>
        <BorderButton
          onClick={() => openModal("signin")}
          className="mx-auto w-70 text-sm md:text-base lg:w-100"
          icon={<Mail className="text-white" />}
        >
          Lanjut dengan email
        </BorderButton>
        <DialogFooter className="mt-8 flex !flex-col gap-2 text-center text-xs">
          Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan kami dan
          mengonfirmasi bahwa kamu telah membaca Kebijakan Privasi dan Cookie
          kami.
          <div className="text-sm">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => openModal("signup")}
              className="text-primary mx-2 cursor-pointer underline underline-offset-4 hover:opacity-90"
            >
              Daftar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLogin;
