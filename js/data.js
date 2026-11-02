/* Embedded copy of data/programmes.json and data/pricing.json so the site also works when opened straight from disk. */
window.CFB_PROGRAMMES = [
  {
    "id": "food-parcel",
    "title": "Monthly Food Parcel Sponsorship",
    "category": "Food",
    "description": "Sponsor food parcels packed with fresh fruit, bread, canned goods and staples for families in Gauteng.",
    "unit": "parcel",
    "costPerUnit": 350,
    "availability": "Open all year",
    "spots": "Unlimited",
    "audience": "Individuals and businesses"
  },
  {
    "id": "water-tanker",
    "title": "Water Tanker Delivery Programme",
    "category": "Water",
    "description": "Fund tanker deliveries of safe drinking water to water-scarce communities, schools and clinics.",
    "unit": "tanker load",
    "costPerUnit": 1200,
    "availability": "Weekly deliveries",
    "spots": "Limited",
    "audience": "Businesses and community groups"
  },
  {
    "id": "borehole",
    "title": "Borehole Maintenance Fund",
    "category": "Water",
    "description": "Contribute towards maintaining and installing community boreholes so families have a reliable water source.",
    "unit": "contribution",
    "costPerUnit": 800,
    "availability": "Quarterly maintenance rounds",
    "spots": "Limited",
    "audience": "Businesses and donors"
  },
  {
    "id": "packing-day",
    "title": "Volunteer Packing Day",
    "category": "Volunteering",
    "description": "Join our team at the packing warehouse to sort, pack and load food parcels for distribution.",
    "unit": "volunteer",
    "costPerUnit": 0,
    "availability": "Saturdays 08:00 - 13:00",
    "spots": "20 volunteers per session",
    "audience": "Individuals, families, school groups"
  },
  {
    "id": "distribution",
    "title": "Distribution Day Volunteer",
    "category": "Volunteering",
    "description": "Help deliver parcels to community sites and welcome families with dignity and care.",
    "unit": "volunteer",
    "costPerUnit": 0,
    "availability": "Weekdays and weekends",
    "spots": "Flexible",
    "audience": "Individuals aged 18+"
  },
  {
    "id": "corporate",
    "title": "Corporate Partnership",
    "category": "Sponsorship",
    "description": "Partner with us on a combined food and water package, with impact reporting for your CSI programme.",
    "unit": "month",
    "costPerUnit": 5000,
    "availability": "By arrangement",
    "spots": "Limited",
    "audience": "Corporates and NPO partners"
  },
  {
    "id": "school-drive",
    "title": "School Food Drive Kit",
    "category": "Food",
    "description": "We supply posters, collection crates and guidance so your school can run its own food drive.",
    "unit": "kit",
    "costPerUnit": 0,
    "availability": "Term time",
    "spots": "10 schools per term",
    "audience": "Schools and youth groups"
  },
  {
    "id": "skills",
    "title": "Skills and Opportunity Mentor",
    "category": "Volunteering",
    "description": "Share your skills with job-seekers as part of our work to tackle unemployment and restore independence.",
    "unit": "mentor",
    "costPerUnit": 0,
    "availability": "Evenings, by appointment",
    "spots": "Limited",
    "audience": "Professionals and graduates"
  }
];
window.CFB_PRICING = {
  "note": "Illustrative figures used for the WEDE5020 assignment.",
  "discounts": [
    {
      "minMonths": 6,
      "rate": 0.05
    },
    {
      "minMonths": 12,
      "rate": 0.1
    }
  ],
  "orientation": {
    "Weekdays": "Tuesday 10:00",
    "Weekends": "Saturday 08:00",
    "Evenings": "Thursday 18:00"
  }
};
