export async function POST(request) {
  try {
    const { title, abstract } = await request.json()
    return Response.json({ 
      title_tr: null, 
      abstract_tr: abstract || null 
    })
  } catch (error) {
    return Response.json({ title_tr: null, abstract_tr: null }, { status: 500 })
  }
}
