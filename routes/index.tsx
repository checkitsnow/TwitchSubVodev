/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { tw } from "@twind";
import LineResult from "../islands/LineResult.tsx";
import getM3u8Urls from "../utils/VodAPI.ts";

interface Data {
  results: Map<string, string>;
  vodURL: string;
}

function replaceMapKey(map: Map<string, string>, key: string, newKey: string) {
  if (map.has(key)) {
    const value = map.get(key) as string;
    map.delete(key);
    map.set(newKey, value);
  }
  return map;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const vodURL = url.searchParams.get("vodURL") || "";

    let results;
    try {
      const parsedVodURL = new URL(vodURL);
      const vodId = parsedVodURL.pathname.split("/videos/")[1].split("?")[0];
      results = await getM3u8Urls(vodId);
    } catch (err) {
      results = new Map();
    }

    replaceMapKey(results, "audio_only", "Audio");
    replaceMapKey(results, "chunked", "Best quality");

    return ctx.render({ results, vodURL });
  },
};

export default function VodForm({ data }: PageProps<Data>) {
  const { results, vodURL } = data;
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <form>
        <div class={tw`flex justify-center`}>
          <div class={tw`mb-3 xl:w-96`}>
            <label
              for="vodURL"
              class={tw`form-label inline-block mb-2 text-gray-700`}
            >
              VOD URL
            </label>
            <input
              type="text"
              class={tw
                `form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 
              bg-white bg-clip-padding border border-solid border-gray-300 rounded transition
              ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`}
              id="vodURL"
              name="vodURL"
              value={vodURL}
              placeholder="https://www.twitch.tv/videos/XXXXXXXXX"
            />
          </div>
        </div>

        <div class={tw`flex space-x-2 justify-center`}>
          <button
            type="submit"
            class={tw
              `inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase
              rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none
              focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
          >
            Search
          </button>
        </div>
      </form>

      <div class={tw`flex justify-center pt-8`}>
        <ul
          class={tw
            `bg-white rounded-lg border border-gray-200 w-96 text-gray-900`}
        >
          {Array.from(results.keys()).reverse().map((quality) => (
            <LineResult quality={quality} value={results.get(quality) ?? ""} />
          ))}
        </ul>
      </div>

      {results.size > 0 && (
        <div class={tw`flex justify-center pt-8`}>
          <h1>
            To view the VOD, use VLC, click on open Network Stream and paste the
            URL into the clipboard.
          </h1>
        </div>
      )}
    </div>
  );
}
