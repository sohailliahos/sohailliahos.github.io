let weightUnit = "kg";
let heightUnit = "cm";

function toggleWeightUnit(unit) {
  weightUnit = unit;
  document.getElementById("kgToggle").classList.toggle("active", unit === "kg");
  document
    .getElementById("lbsToggle")
    .classList.toggle("active", unit === "lbs");
  document.getElementById("weight").placeholder =
    unit === "kg" ? "Enter weight (kg)" : "Enter weight (lbs)";
}

function toggleHeightUnit(unit) {
  heightUnit = unit;
  document.getElementById("cmToggle").classList.toggle("active", unit === "cm");
  document.getElementById("ftToggle").classList.toggle("active", unit === "ft");
  if (unit === "cm") {
    document.getElementById("heightCm").style.display = "block";
    document.getElementById("heightFtInch").classList.remove("active");
  } else {
    document.getElementById("heightCm").style.display = "none";
    document.getElementById("heightFtInch").classList.add("active");
  }
}

function calculateDeficit() {
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  let weight = document.getElementById("weight").value;
  let height =
    heightUnit === "cm"
      ? document.getElementById("heightCm").value
      : {
          ft: document.getElementById("heightFt").value,
          inch: document.getElementById("heightInch").value,
        };
  const activity = document.getElementById("activity").value;
  const deficit = document.getElementById("deficit").value;

  if (
    !age ||
    !weight ||
    (!height && heightUnit === "cm") ||
    (!height.ft && !height.inch && heightUnit === "ft") ||
    !activity ||
    !deficit
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const deficitPercentage = parseFloat(deficit) / 100;
  if (deficitPercentage < 0 || deficitPercentage > 1) {
    alert("Please enter a valid deficit percentage (0-100).");
    return;
  }

  // Convert weight to kg if in pounds
  if (weightUnit === "lbs") {
    weight = weight / 2.20462;
  }

  // Convert height to cm if in feet and inches
  if (heightUnit === "ft") {
    height = height.ft * 30.48 + height.inch * 2.54;
  }

  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  let caloriesNeeded;

  switch (activity) {
    case "sedentary":
      caloriesNeeded = bmr * 1.2;
      break;
    case "light":
      caloriesNeeded = bmr * 1.375;
      break;
    case "moderate":
      caloriesNeeded = bmr * 1.55;
      break;
    case "active":
      caloriesNeeded = bmr * 1.725;
      break;
    case "extra":
      caloriesNeeded = bmr * 1.9;
      break;
    default:
      caloriesNeeded = bmr * 1.2;
  }

  const deficitCalories = caloriesNeeded * (1 - deficitPercentage);
  document.getElementById(
    "result"
  ).innerText = `Your daily calorie needs are approximately ${caloriesNeeded.toFixed(
    0
  )} calories. To achieve a ${deficit}% calorie deficit, aim for around ${deficitCalories.toFixed(
    0
  )} calories per day.`;
}

async function loadPosts() {
  const response = await fetch("http://localhost:3000/api/blogs");
  const posts = await response.json();
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "blog-post";
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        `;
    postsContainer.appendChild(postElement);
  });
}

async function submitPost() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (title && content) {
    const response = await fetch("http://localhost:3000/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    const newPost = await response.json();
    loadPosts();
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
  } else {
    alert("Please enter both a title and content.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("posts")) {
    loadPosts();
  }
  toggleWeightUnit("kg");
  toggleHeightUnit("cm");
});
