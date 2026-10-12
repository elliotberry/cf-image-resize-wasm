import {StatusError} from 'itty-router';

const explainUpstreamFailure = (finalURL, status, statusText) => {
  const statusLine = `${status} ${statusText || ''}`.trim();
  let why = 'The image host did not return the file.';

  if (status === 401) {
    why = 'The image host requires authentication (401 Unauthorized). This worker cannot resize an image it is not allowed to fetch.';
  } else if (status === 403) {
    why = 'The image host refused the download (403 Forbidden). Sites often do this with hotlink protection, a login wall, or a bot check. This worker cannot resize an image it is not allowed to fetch.';
  } else if (status === 404) {
    why = 'The image host says that URL does not exist (404 Not Found).';
  } else if (status >= 500) {
    why = 'The image host failed while serving the file.';
  }

  return `Could not download the image.\n\n${why}\n\nHost response: ${statusLine}\nURL: ${finalURL}`;
};

const fetchImage = async finalURL => {
  const headers = {
    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (compatible; image-resize-proxy/1.0)',
  };
  if (finalURL.protocol === 'http:' || finalURL.protocol === 'https:') {
    headers.Referer = `${finalURL.origin}/`;
  }

  let res;
  try {
    res = await fetch(finalURL, {
      headers,
      redirect: 'follow',
    });
  } catch (err) {
    const detail = err?.message ? `: ${err.message}` : '.';
    throw new StatusError(
      502,
      `Could not download the image.\n\nThe request to ${finalURL} failed before a response arrived${detail}`,
    );
  }

  if (!res.ok || res.status !== 200) {
    throw new StatusError(502, explainUpstreamFailure(finalURL, res.status, res.statusText));
  }

  return res;
};

export default fetchImage;
