"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CartItem from "./cart-item";
import type { CartItem as Item } from "@/hooks/merchant/use-add-product-to-cart";
import EmptyCard from "./empty-card";
import { Button } from "@/components/ui/button";
import Cart from "@/components/icons/cart";
import { useParams, useRouter } from "next/navigation";

import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "@/components/shared/dialog-login";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import DialogSignup from "@/components/shared/dialog-signup";

interface CartCardProps {
  className?: string;
  cart: Item[];
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totals: { totalQty: number; totalPrice: number };
}

const CartCard = ({
  className,
  cart,
  increment,
  decrement,
  totals,
}: CartCardProps) => {
  const { merchantId } = useParams();
  const router = useRouter();
  const { data } = useGetUser();
  const {
    openModal,
    defaultModalIsOpen,
    closeModal,
    signInIsOpen,
    signUpIsOpen,
    onCloseSignup,
  } = useOpenModal();
  const isAuthenticated = !!data;
  const paymentId = crypto.randomUUID();
  const handleToPayment = () => {
    if (!isAuthenticated) {
      console.log("modal opened");
      openModal("default");
      return;
    }
    return router.push(`/payment/${paymentId}`);
  };

  return (
    <>
      <Card className={className}>
        <CardContent className="p-5 md:p-6">
          <CardHeader className="mb-4 flex items-center justify-between p-0">
            <CardTitle className="text-base font-bold lg:text-xl">
              Keranjang
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {totals?.totalQty ?? 0} item
            </p>
          </CardHeader>
          <div className="w-full space-y-3">
            {cart.length === 0 && <EmptyCard />}
            {cart.map((it) => (
              <CartItem
                key={it.id}
                id={it.id}
                name={it.name}
                photo_url={it.photo_url}
                price={it.price}
                quantity={it.quantity}
                onInc={() => increment(it.id)}
                onDec={() => decrement(it.id)}
              />
            ))}
          </div>
          {cart.length > 0 && (
            <Button
              className="group relative mt-5 flex w-full items-center justify-center overflow-hidden bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-5 text-base font-bold md:py-6 md:text-lg lg:text-xl"
              onClick={handleToPayment}
            >
              <span className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(79deg,#FD6700_64.73%,#FF944B_114.39%)] transition-transform duration-500 ease-in-out group-hover:translate-x-0" />

              <p className="z-100">Cek Keranjang</p>
              <Cart className="transition-all duration-500 group-hover:translate-x-2" />
            </Button>
          )}
        </CardContent>
      </Card>
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
    </>
  );
};

export default CartCard;
