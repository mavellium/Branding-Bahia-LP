export async function GET() {
  const res = await fetch("https://dashboard-brandingbahia.vercel.app/api/form/setors", {
    cache: "no-store"
  });

  const data = await res.json();
  return Response.json(data);
}