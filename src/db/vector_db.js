export async function getClosestArticle(param) {
    const res = await fetch(`http://127.0.0.1:8000/closest_article?sentence=${encodeURIComponent(param)}`);
    const data = await res.json()
    const summary = data.results?.[0]?.payload?.summary || "No summary found";
    console.log(summary);
    return summary
}