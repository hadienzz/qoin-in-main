import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardExpress = () => {
  return (
    <Card>
      <CardHeader className="text-[#8D8D8D]">
        <CardTitle className=" lg:text-lg text-sm font-medium">
          Alamat
        </CardTitle>
        <CardDescription className="text-[#333] lg:text-lg text-sm font-medium">
          Universitas Telkom Jakarta - Kampus Minangkabau, Jl. Minangkabau Barat
          No.50, RT.1/RW.1, Pasar Manggis, Setiabudi, South Jakarta City,
          Jakarta 12970
        </CardDescription>
        <CardFooter className="!px-0 lg:text-lg text-sm font-medium space-x-5">
          <p>John Doe</p>
          <p>+62-85156473876</p>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

export default CardExpress;
