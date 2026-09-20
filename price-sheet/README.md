# Price sheet connection

Product prices on the site come from one Google Sheet, "Fiesta Jumps Prices (website)":
https://docs.google.com/spreadsheets/d/1m6kAjiEGG3M5-mG4sRrAWLy7DDX4WWNn_roi5En_icU

It is owned by demoniksd4@gmail.com. Edit it while signed in to that account.

## How it works

1. Every page loads `main.js`, which fetches the sheet as CSV straight from Google. There is no server and
   no API key, so it works on localhost, GitHub Pages and WordPress.
2. Each sheet row is matched to a product card, and the number after `from $` on the card and in the
   Details popup is replaced with the sheet's Price.
3. The price already written in the HTML is the fallback. If the sheet is unreachable, or a product has no
   row in the sheet, that product keeps its HTML price.
4. The result is kept for the browser tab, so the next page shows the new prices immediately.

## Changing a price

Edit the Price cell (column D) of the product's row. Nothing else.

## How often it updates

* On every page load (at most one fetch per minute per browser tab).
* Every 5 minutes while a page stays open.
* Google itself can take up to a minute to publish an edit.

To change the interval, edit `PRICE_REFRESH_MS` in the price section of `main.js`.

## Sharing settings

The sheet's link is inside `main.js`, so anyone can find it. Keep the link access at
**Anyone with the link: Viewer**. The site only reads it, and Viewer means nobody else can change prices.
If the link were set to Editor, anyone who found it could change the prices shown on the website.

## The sheet layout

One flat tab, one product per row: Category, Item Name, Dimensions / Notes, Price, Rental Time, Extra Hour,
Overnight, Quantity Available, Circuit Breakers (20A) Needed, Web ID.

* Only the **first tab** is read. Keep all products on it.
* Keep the header row (the one that says Price). The columns are found by their header names.

## How a sheet row finds its product

1. By the **Web ID** column: the product's id, which is the text after `?item=` in its Get Quote link.
   Several ids can share one row, separated by commas. This survives renaming the product.
2. Otherwise by Item Name, using `PRICE_NAME_MAP` in `main.js`.

## Adding a new product

Add a row with its Item Name, Price and Web ID. Use the same id in the product card's Get Quote link
(`?item=...`) and its Details button (`data-book`). Until the card has an id that matches a row, it keeps its
HTML price.

## Rows that have no product on the site

These rows are ignored: 13x13 Jumpers, Rainbow Castle Bounce House #2, Pink Castle 5-in-1 Combo,
Obstacle Course w/ 16 ft Slide, White Canopy 12x20 and 20x40 (walls included), Carnival Canopies, and the
inventory rows with no price (Banner, Long Tables, Round Table, Folding Chairs (Eco), Resin Chairs,
Trackless Train).

## Other files here

* `prices-flat.csv`: a local copy of the sheet's contents from when it was created.
* `rows-to-add.tsv`: the 35 products that were added to the sheet because the owner's original sheet did
  not have them. A record only; the sheet already contains them.

## The owner's original sheet

The original sheet (`1F6dpE_5hcSgjGb2UYE9Q2KJjkTobA0drhlbM9Lb5esc`, 16 tabs) is **no longer read** by the
site. Editing it changes nothing on the website.
