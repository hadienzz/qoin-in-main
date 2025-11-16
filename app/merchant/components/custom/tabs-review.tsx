import RatingStar from "@/components/icons/rating-star";
import CommentCard from "@/components/shared/comment-card";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";

type ReviewContent = {
  percentage: number;
  number: number;
};

const ReviewBar = ({ percentage, number }: ReviewContent) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm lg:text-base">
      {/* angka + icon */}
      <div className="flex items-center justify-end gap-3 w-[36px] ">
        <p className="font-medium text-gray-700">{number}</p>
        <RatingStar className="text-yellow-500 size-4" />
      </div>

      {/* progress bar */}
      <Progress
        value={percentage}
        className="h-2 bg-[#E1E1E1] [&>div]:bg-primary rounded-full"
      />

      {/* persentase */}
      <p className="w-[40px] text-right text-gray-700 font-medium">
        {percentage}%
      </p>
    </div>
  );
};
const reviewContent: ReviewContent[] = [
  { percentage: 90, number: 5 },
  { percentage: 10, number: 4 },
  { percentage: 0, number: 3 },
  { percentage: 0, number: 2 },
  { percentage: 0, number: 1 },
];

const TabsReview = () => {
  return (
    <TabsContent value="reviews">
      <Card className="lg:px-7.5 px-5 ">
        <CardContent className="!px-0 lg:grid grid-cols-3">
          <div className="space-y-3 mb-4 lg:mb-0">
            <h1 className="text-primary text-3xl font-semibold">4.9</h1>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="text-yellow-500">
                  <RatingStar />
                </div>
              ))}
            </div>
            <p className="text-[#8D8D8D] text-sm lg:text-base font-medium">
              Berdasarkan 128 ulasan
            </p>
          </div>
          <div className="col-span-2 ">
            {reviewContent.map((item, index) => (
              <ReviewBar key={index} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-none ">
        <CardContent className="!p-0">
          <div>
            <CommentCard className="!w-full" isReview={true} />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TabsReview;
