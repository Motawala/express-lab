import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());   


let categories = ['successQuotes', 'perseveranceQuotes', 'happinessQuotes'];

let successQuotes = [
  {
    'quote': 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'author': 'Winston S. Churchill'
  },
  {
    'quote': 'The way to get started is to quit talking and begin doing.',
    'author': 'Walt Disney'
  }
];

let perseveranceQuotes = [
  {
    'quote': 'It’s not that I’m so smart, it’s just that I stay with problems longer.',
    'author': 'Albert Einstein'
  },
  {
    'quote': 'Perseverance is failing 19 times and succeeding the 20th.',
    'author': 'Julie Andrews'
  }
];

let happinessQuotes = [
  {
    'quote': 'Happiness is not something ready made. It comes from your own actions.',
    'author': 'Dalai Lama'
  },
  {
    'quote': 'For every minute you are angry you lose sixty seconds of happiness.',
    'author': 'Ralph Waldo Emerson'
  }
];




app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name : "Karan Patel" });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.get("/math/circle/:radius", (req, res) => {

    const radius = parseFloat(req.params.radius);

    if (isNaN(radius)) {
        return res.status(400).json({ error: "Radius must be a number." });
    }

    // Compute the area and Circumference of the circle.
    let circleArea = Math.PI * radius * radius;
    let circleCircumference = 2 * Math.PI * radius;
    // Parse the values
    circleArea = parseFloat(circleArea)
    circleCircumference = parseFloat(circleCircumference)

    // Return the response.
    res.json({
        area: circleArea,
        circumference: circleCircumference
    });
});


app.get("/math/rectangle/:length/:width", (req, res) => {
  const length = parseFloat(req.params.length);
  const width = parseFloat(req.params.width);

  let rectArea = length * width;
  let rectPerimeter = (2 * length) + (2 * width);
  rectArea = parseFloat(rectArea);
  rectPerimeter = parseFloat(rectPerimeter);

  res.json({
    "area": rectArea,
    "perimeter": rectPerimeter
  })
})

app.get("/math/power/:base/:exponent", (req, res) => {
  const base = parseFloat(req.params.base);
  const exponent = parseFloat(req.params.exponent);
  const isRoot = req.query.root === "true";


  if (isNaN(base) || isNaN(exponent)){
    return res.status(400).json({ error: "Base and exponent must be numbers." });
  }


  const result = Math.pow(base, exponent);

  if (isRoot) {
        return res.json({
            result: result,
            root: 2
        });
    }

    res.json({
        result: result
    });
})

// 1.1 Fetch Categories
app.get("/quotebook/categories", (req, res) => {
  
  const responseText = categories
        .map(c => `A possible category is ${c}`)
        .join("\n\n");

    res.type("text/plain").send(responseText);
    
})

//1.2 Quotes of a category
app.get("/quotebook/quote/:category", (req, res) => {

  const categorySelected = req.params.category;

  if (!categories.includes(categorySelected)){
    return res.status(404).json({
      error: `no category listed for ${category}`
    });
  }

  let quote;

  if (categorySelected === "successQuotes") {
    quote = successQuotes;
  } else if (categorySelected === "perseveranceQuotes") {
    quote = perseveranceQuotes;
  } else if (categorySelected === "happinessQuotes") {
    quote = happinessQuotes;
  }

  const randomIndex = Math.floor(Math.random() * quote.length);
  const randomQuote = quote[randomIndex];

  res.json(randomQuote);

})


app.post("/quotebook/quote/new", (req, res) => {
  const { category, quote, author } = req.body;

  // Validate required fields
  if (!category || !quote || !author || !categories.includes(category)) {
    return res.status(400).json({
      error: "invalid or insufficient user input"
    });
  }

  // Determine the correct array to push into
  let targetArray;

  if (category === "successQuotes") {
    targetArray = successQuotes;
  } else if (category === "perseveranceQuotes") {
    targetArray = perseveranceQuotes;
  } else if (category === "happinessQuotes") {
    targetArray = happinessQuotes;
  }

  // Add the new quote
  targetArray.push({
    quote: quote,
    author: author
  });

  // Respond with plain text
  res.send("Success!");
})


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});