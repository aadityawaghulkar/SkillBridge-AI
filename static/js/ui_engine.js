/**
 * SkillBridge AI — KNN Career Prediction & Skill Gap Engine
 * Multi-dimensional vector space matching algorithm for career trajectories.
 * Compatible with both ES Modules and standard file:// browser script execution.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.SkillBridgeUI = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const SKILL_SIGNALS = [
  { id: "Python", name: "Python", category: "Programming" },
  { id: "Java", name: "Java", category: "Programming" },
  { id: "C++", name: "C++", category: "Programming" },
  { id: "JavaScript", name: "JavaScript", category: "Programming" },
  { id: "HTML", name: "HTML", category: "Web" },
  { id: "CSS", name: "CSS", category: "Web" },
  { id: "React", name: "React", category: "Web" },
  { id: "Node.js", name: "Node.js", category: "Web" },
  { id: "SQL", name: "SQL", category: "Database" },
  { id: "Database Design", name: "Database Design", category: "Database" },
  { id: "Machine Learning", name: "Machine Learning", category: "AI" },
  { id: "Deep Learning", name: "Deep Learning", category: "AI" },
  { id: "Data Analytics", name: "Data Analytics", category: "Data" },
  { id: "Excel", name: "Excel", category: "Data" },
  { id: "Cloud Computing", name: "Cloud Computing", category: "Cloud" },
  { id: "Linux", name: "Linux", category: "System" },
  { id: "Networking", name: "Networking", category: "System" },
  { id: "Cyber Security", name: "Cyber Security", category: "Security" },
  { id: "Git", name: "Git", category: "Tools" },
  { id: "UI/UX Design", name: "UI/UX Design", category: "Design" }
];

const CAREER_DATABASE = [
{
id:"ai_ml_engineer",
title:"AI / Machine Learning Engineer",
category:"Artificial Intelligence",
growth:"+35%",
description:"Designs and develops intelligent systems using Machine Learning, Deep Learning and AI technologies.",
requiredSkills:[
"Python",
"Machine Learning",
"Deep Learning",
"SQL",
"Data Analytics"
]
},

{
id:"data_scientist",
title:"Data Scientist",
category:"Data Science",
growth:"+28%",
description:"Builds predictive models and extracts valuable insights from structured and unstructured data.",
requiredSkills:[
"Python",
"SQL",
"Excel",
"Data Analytics",
"Machine Learning"
]
},

{
id:"data_analyst",
title:"Data Analyst",
category:"Data Analytics",
growth:"+22%",
description:"Analyzes datasets, creates reports and dashboards to support business decisions.",
requiredSkills:[
"Excel",
"SQL",
"Python",
"Data Analytics"
]
},

{
id:"full_stack_developer",
title:"Full Stack Developer",
category:"Web Development",
growth:"+30%",
description:"Develops complete web applications including frontend, backend and database systems.",
requiredSkills:[
"HTML",
"CSS",
"JavaScript",
"React",
"Node.js",
"SQL"
]
},

{
id:"frontend_developer",
title:"Frontend Developer",
category:"Web Development",
growth:"+24%",
description:"Builds responsive and interactive user interfaces for modern web applications.",
requiredSkills:[
"HTML",
"CSS",
"JavaScript",
"React",
"UI/UX Design"
]
},

{
id:"backend_developer",
title:"Backend Developer",
category:"Software Development",
growth:"+26%",
description:"Develops server-side applications, APIs and database systems.",
requiredSkills:[
"Python",
"SQL",
"Node.js",
"Database Design"
]
},

{
id:"cyber_security_analyst",
title:"Cyber Security Analyst",
category:"Cyber Security",
growth:"+32%",
description:"Protects systems and networks against cyber attacks and security threats.",
requiredSkills:[
"Cyber Security",
"Networking",
"Linux",
"Python"
]
},

{
id:"cloud_engineer",
title:"Cloud Engineer",
category:"Cloud Computing",
growth:"+31%",
description:"Deploys, manages and optimizes cloud infrastructure and cloud-based applications.",
requiredSkills:[
"Cloud Computing",
"Linux",
"Networking"
]
},

{
id:"devops_engineer",
title:"DevOps Engineer",
category:"Cloud & DevOps",
growth:"+33%",
description:"Automates deployment pipelines, CI/CD workflows and infrastructure management.",
requiredSkills:[
"Linux",
"Git",
"Cloud Computing",
"Networking"
]
},

{
id:"software_developer",
title:"Software Developer",
category:"Software Engineering",
growth:"+21%",
description:"Designs, develops, tests and maintains desktop and enterprise software applications.",
requiredSkills:[
"Java",
"C++",
"SQL",
"Git"
]
},

{
id:"uiux_designer",
title:"UI/UX Designer",
category:"Design",
growth:"+20%",
description:"Designs intuitive user interfaces and improves overall user experience.",
requiredSkills:[
"UI/UX Design",
"HTML",
"CSS",
"JavaScript"
]
},

{
id:"database_administrator",
title:"Database Administrator",
category:"Database Management",
growth:"+18%",
description:"Manages, secures and optimizes organizational database systems.",
requiredSkills:[
"SQL",
"Database Design",
"Linux"
]
}
];

  


  return {
    SKILL_SIGNALS,
    CAREER_DATABASE
};
}));
