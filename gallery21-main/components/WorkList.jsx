import "@styles/WorkList.scss";
import WorkCard from "./WorkCard";
import Loader from "./Loader/Loader";

const WorkList = ({ data = [] }) => {

  return !data ? (
    <Loader />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {data?.map((work) => (
    <WorkCard key={work?._id} work={work} />
  ))}
</div>

  );
};

export default WorkList;
