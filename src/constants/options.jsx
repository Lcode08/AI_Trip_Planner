// Emojis/Stickers are taken from the website "emojipedia.org"
export const SelectTravelesList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole travels in exploration',
        icon:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two travelers in tandem',
        icon:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A Group of fun loving adventure',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekes',
        icon:'⛵',
        people:'5 to 10 People'
    },

]

export const SelectBudgetOptions= [
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵'
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰'
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸'
    }
]

export const AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {Travelers} with a {budget} budget. Provide a Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, and descriptions. Suggest the itinerary in JSON format as an array called "itinerary" where each element contains "day" (e.g., 'Day 1'), and a "plan" (an array of objects). Each object in "plan" should include:
1. placeName,
2. placeDetails,
3. placeImageUrl,
4. geoCoordinates,
5. ticketPricing,
6. timeTravel, and
7. bestTimeToVisit for each location.
Ensure the output format is consistent with this structure without affecting the hotel options.`
