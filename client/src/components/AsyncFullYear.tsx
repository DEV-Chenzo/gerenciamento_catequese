"use server";

export default async function AsyncFullYear() {
  const currentYear = await new Date().getFullYear();
  return (
    <div className="flex flex-row w-55 px-3 py-2 my-3 items-center justify-between bg-surface-dim rounded-lg">
      <p className="font-sans text-xs font-medium text-on-surface-variant">
        Ano Patoral
      </p>
      <div className="flex items-center justify-center w-10 h-6 bg-orange-200 rounded-lg">
        <p className="font-sans text-xs font-medium text-on-surface-variant">
          {currentYear}
        </p>
      </div>
    </div>
  );
}
