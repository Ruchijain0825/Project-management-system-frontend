
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {value}
          </h2>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>

      </div>

    </div>
  );
};

export default StatCard;
