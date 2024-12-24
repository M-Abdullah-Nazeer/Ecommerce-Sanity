

async function SinglePage({searchParams,}:{searchParams: {query: string}}) {


    const {query} =await searchParams; 

  return (
    <div>search page {query}</div>
  )
}

export default SinglePage