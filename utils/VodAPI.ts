export default async function getM3u8Urls(vodId: string) {
    const videoRawData = await fetch(`https://api.twitch.tv/kraken/videos/${vodId}`, {
        method: 'GET',
        headers: {
            "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            "Accept": "application/vnd.twitchtv.v5+json",
            "User-Agent": "Mozilla/5.0",
        }
    }).then(res => res.json())
    const seekPreviewsUrl = new URL(videoRawData.seek_previews_url)
    const baseUrl = seekPreviewsUrl.origin + seekPreviewsUrl.pathname.split('/storyboards/')[0]

    const m3u8Urls = new Map<string, string>()
    for (const resolution of Object.keys(videoRawData.resolutions)) {
        m3u8Urls.set(resolution, baseUrl + `/${resolution}/index-dvr.m3u8`)
    }
    m3u8Urls.set("audio_only", baseUrl + "/audio_only/index-dvr.m3u8")

    return m3u8Urls
}

/*
async function getAllM3u8Quality(vodId: string) {
    const m3u8Urls = new Map()
    const tokenRawData = await fetch(`https://gql.twitch.tv/gql`, {
        method: 'POST',
        headers: {
            "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify({
            "operationName": "PlaybackAccessToken",
            "variables": {
                "isLive": false,
                "login": "",
                "isVod": true,
                "vodID": `${vodId}`,
                "playerType": "channel_home_live"
            },
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"
                }
            }
        })
    }).then(res => res.json())
    const vodToken = JSON.parse(tokenRawData.data.videoPlaybackAccessToken.value).chansub.restricted_bitrates
    for (let i = 0; i < vodToken.length; i++) {
        m3u8Urls.set(vodToken[i], "/" + vodToken[i] + "/index-dvr.m3u8")
    }

    return m3u8Urls
}
*/