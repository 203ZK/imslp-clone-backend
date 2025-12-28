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
    const { imslpKey, link } = req.body;

    const prefix = link.slice(8, 13) + "IMSLP";
    const suffix = "-" + link.slice(13);

    const mirrors = [
        "https://vmirror.imslp.org/files/imglnks/usimg/",
        "https://imslp.eu/files/imglnks/euimg/",
    ];

    const links = [
        prefix + imslpKey + suffix,
        prefix + "0" + imslpKey + suffix
    ];
    let foundUrl = "";

    for (let link of links) {
        for (let mirror of mirrors) {
            const url = mirror + link;
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok) {
                foundUrl = url;
                break;
            }
        }
    }
    
    res.send({ "link": foundUrl });
}