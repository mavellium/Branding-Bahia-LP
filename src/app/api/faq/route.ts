export async function GET() {
  const res = await fetch("https://dashboard-brandingbahia.vercel.app/api/form/faq", {
    cache: "no-store"
  });

  const data = await res.json();
  return Response.json(data);
}