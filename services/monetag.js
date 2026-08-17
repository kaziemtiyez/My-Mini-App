let monetagFunction = null;

export function initMonetag(
  functionName
) {

  if (!functionName) {
    console.error(
      "Monetag function name missing"
    );

    return false;
  }

  if (
    typeof window[functionName] !==
    "function"
  ) {
    console.error(
      `Monetag ${functionName}() is not loaded`
    );

    return false;
  }

  monetagFunction =
    window[functionName];

  return true;
}

export async function showMonetag(
  ymid
) {

  if (!monetagFunction) {
    throw new Error(
      "Monetag is not initialized"
    );
  }

  await monetagFunction({
    type: "end",
    ymid,
    requestVar: "reward_button"
  });

  return true;
}
