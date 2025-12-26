// async function getLinkByWorkId(workId) {
//     const { data } = await supabase
//         .from('works')
//         .select()
//         .eq('id', workId);

//     if (data?.length === 0) {
//         console.log('Could not find work with ID:', workId);
//     } else {
//         return data[0];
//     }
// };

// export async function getScoresByWorkId(req, res) {
//     const { workId } = req.params;
    
//     const response = await getLinkByWorkId(workId);
//     const scraped = await scrapeWorkForScores(response.perm_link);

//     res.send(scraped);
// }

export async function getScoreByLink(req, res) {
    const { encodedLink } = req.body;

    const mirrors = [
        "https://vmirror.imslp.org/files/imglnks/usimg/",
        "https://imslp.eu/files/imglnks/euimg/",
    ];

    let foundUrl = "";

    for (let mirror of mirrors) {
        const url = mirror + encodedLink;
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok) { foundUrl = url; }
    }
    
    res.send({ "link": foundUrl });
}