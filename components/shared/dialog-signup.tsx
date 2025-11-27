"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useSignup from "@/hooks/auth/use-signup";

interface DialogSignupProps {
  open: boolean;
  onClose: () => void;
}

const DialogSignup = ({ open, onClose }: DialogSignupProps) => {
  const { formik, isSubmitting } = useSignup({
    onSuccessCallback: () => {
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <Image
            src={"/logo.svg"}
            width={96}
            height={96}
            alt="Logo"
            className="mx-auto"
          />
          <DialogTitle className="text-secondary text-center text-base font-bold lg:text-3xl">
            Daftar dulu yuk, biar bisa dukung UMKM favoritmu
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              aria-invalid={Boolean(formik.errors.email)}
            />
            {formik.errors.email ? (
              <p className="text-destructive text-xs">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              aria-invalid={Boolean(formik.errors.password)}
            />
            {formik.errors.password ? (
              <p className="text-destructive text-xs">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>

        <DialogFooter className="mt-6 text-center text-xs">
          Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan kami dan
          mengonfirmasi bahwa kamu telah membaca Kebijakan Privasi dan Cookie
          kami.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSignup;
