interface RawLiturgyResponse {
  date: string;
  liturgy: string;
  color: string;
  entranceAntiphon: string;
  communionAntiphon: string;
}

export default async function liturgyService() {
  const response = await fetch("https://liturgia.up.railway.app/v2/");
  const data = await response.json();
  const liturgyData: RawLiturgyResponse = {
    date: data.data,
    liturgy: data.liturgia,
    color: data.cor,
    entranceAntiphon: data.antifonas.entrada,
    communionAntiphon: data.antifonas.comunhao,
  };
  console.log("Liturgy data fetched successfully");
  return liturgyData;
}

// liturgyService().catch((error) => {
//   console.error('Error fetching liturgy data:', error);
// });
