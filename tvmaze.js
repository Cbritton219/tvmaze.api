"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_API_URL = "https://www.tvmaze.com/api"
const DefaultIamge = "https://tinyurl.com/tv-missing"


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const resp = await axios({
    baseurl: TVMAZE_API_URL,
    url: "search/shows",
    method: "get",
    params: { q: term, },
  });

  return resp.data.map.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image : DefaultIamge,
    };
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
async function getEpisodesOfShow(id) {
  const resp = await axios({
    baseurl: TVMAZE_API_URL,
    url: `show/${id}/episodes`,
    method: "Get"
  });
  return resp.data.map(event => ({
    id: event.id,
    name: event.name,
    season: event.season,
    Number: event.Number,
  }));
}


/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  for (let episode of episodes) {
    const $item = $(`<li> ${episode.name}(season ${episode.season}, episode ${episode.num}`);
    $episodesList.append($item);
  }
  $episodesArea.show();
}

async function getEpisodesandDisplay(evt) {
  const showId = $(evt.traget).closest(".show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesandDisplay)