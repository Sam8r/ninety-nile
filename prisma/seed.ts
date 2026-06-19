import { PrismaClient, Role, Status, CaseStudyCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type Metric = { labelEn: string; labelAr: string; value: string };
type ExternalLink = { label: string; url: string };

async function main() {
  console.log("🌱 Seeding NinetyNile…");

  // --- Admin user ---------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@ninetynile.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMeNow123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Admin", role: Role.ADMIN },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@ninetynile.com" },
    update: {},
    create: {
      email: "editor@ninetynile.com",
      passwordHash: await bcrypt.hash("EditorPass123", 12),
      name: "Editor",
      role: Role.EDITOR,
    },
  });

  // --- Branding (singleton) ----------------------------------------------
  await prisma.brandSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteNameEn: "NinetyNile",
      siteNameAr: "ناينتي نايل",
      taglineEn: "Creativity, Overflowing.",
      taglineAr: "الإبداع يفيض.",
      secondaryTaglineEn: "A boutique creative communication consultancy and content creation agency — rooted in Sudan, working across the globe.",
      secondaryTaglineAr: "وكالة استشارات الاتصال الإبداعية وبناء المحتوى",
      colorPrimary: "#0a0a0a",
      colorSecondary: "#005fa8",
      colorAccent: "#e10600",
      colorBg: "#ffffff",
      colorText: "#0a0a0a",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
    },
  });

  // --- Contact details (singleton) ---------------------------------------
  await prisma.contactDetails.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      email: "safa@ninetynile.com",
      phone: "+44 (0)7956925540",
      website: "ninetynile.com",
      instagram: "https://instagram.com/19NinetyNile",
      tiktok: "https://tiktok.com/@19ninetynile",
      addressesEn: [
        "Port Sudan, Sudan",
        "Nairobi, Kenya",
        "London, United Kingdom",
      ],
      addressesAr: ["بورتسودان، السودان", "نيروبي، كينيا", "لندن، المملكة المتحدة"],
    },
  });

  // --- Site content (keyed copy) -----------------------------------------
  const siteContent: Array<{
    key: string;
    titleEn: string;
    titleAr: string;
    bodyEn: string;
    bodyAr: string;
  }> = [
    {
      key: "HOME_INTRO",
      titleEn: "Creativity, Overflowing.",
      titleAr: "الإبداع يفيض.",
      bodyEn: "A boutique creative communication consultancy and content creation agency, originally where the two Niles meet — Khartoum, Sudan. We remain creative, remain rooted, remain true.",
      bodyAr: "وكالة استشارات اتصال إبداعية وبناء محتوى، نشأت حيث يلتقي النيلان — الخرطوم، السودان. نبقى مبدعين، نبقى متجذرين، نبقى أوفياء لحقيقتنا.",
    },
    {
      key: "ABOUT_STORY",
      titleEn: "Our Story",
      titleAr: "قصتنا",
      bodyEn: "Boutique Creative Communication Consultancy & Content Creation Agency, originally where the two Niles meet — Khartoum, Sudan. In 2023 we operated from Nairobi (Kenya) & London (UK) due to the war. As Sudan recovers, we operate from Port Sudan, working across states. Our essence: to remain creative, to remain rooted, to remain true.",
      bodyAr: "وكالة استشارات اتصال إبداعية وبناء محتوى، نشأت حيث يلتقي النيلان — الخرطوم، السودان. في عام 2023 عملنا من نيروبي (كينيا) ولندن (المملكة المتحدة) بسبب الحرب. ومع تعافى السودان، نعمل من بورتسودان عبر الولايات. جوهرنا: أن نبقى مبدعين، متجذرين، أوفياء لحقيقتنا.",
    },
    {
      key: "CAUSE_EFFECT",
      titleEn: "Cause & Effect",
      titleAr: "السبب والأثر",
      bodyEn: "Curiosity into how minds react to stimuli; ideas tailored to each target — original, relevant, timeless, and Sudanese. You are only one post away from your greatest audience.",
      bodyAr: "فضولٌ لمعرفة كيف تتفاعل العقول مع المحفّزات؛ أفكار مصمّمة لكل جمهور — أصيلة، ذات صلة، خالدة، وسودانية. أنت على بُعد منشور واحد من أعظم جمهور لك.",
    },
    {
      key: "WHY_CONTENT",
      titleEn: "Why Content",
      titleAr: "لماذا المحتوى",
      bodyEn: "Content keeps organisations relevant, generates continuous dialogue, attracts and retains audiences as the line between advertising and PR blurs.",
      bodyAr: "المحتوى يبقى المنظمات ذات صلة، ويولّد حوارًا مستمرًا، ويجذب الجمهور ويحافظ عليه مع تلاشي الحد بين الإعلان والعلاقات العامة.",
    },
    {
      key: "BRAND_EXPERIENCE",
      titleEn: "Brand Experiences & Events",
      titleAr: "تجارب العلامة والفعاليات",
      bodyEn: "How a person interacts with your brand is everything. Brand is why you exist (a promise); experience is what you do (the proof). In-store experiences, launch events, sponsorships, pop-ups, meetings — memorable, buzz-worthy, PR-able.",
      bodyAr: "كيف يتفاعل الشخص مع علامتك هو كل شيء. العلامة هي سبب وجودك (وعد)، والتجربة هي ما تفعله (الدليل). التجارب داخل المتاجر، فعاليات الإطلاق، الرعايات، البوب أب، الاجتماعات — لا تُنسى، وتصنع ضجيجًا، وقابلة للعلاقات العامة.",
    },
    {
      key: "COMMUNITY_ACHIEVEMENT",
      titleEn: "Al Qiyadah Nights / #elQiyadaNights",
      titleAr: "ليالي القيادة / #ليالي_القيادة",
      bodyEn: "On 6 April 2019, during the HQ sit-in of the revolution, we reclaimed and rehabilitated an open-air dump into Al Qiyadah's most celebrated cultural space. An event series featured figures like Alaa Satir, Galal Yousif, Asil Diab, Mohamed Kordofani, Hajooj Kuka, Yousra El Bagir, and Mohammed Mattar.",
      bodyAr: "في 6 أبريل 2019، خلال اعتصام القيادة العامة للثورة، استعدنا وأهلكنا مكبّ نفايات مكشوفًا وحوّلناه إلى أكثر الفضاءات الثقافية احتفاءً في القيادة. تضمّنت سلسلة الفعاليات شخصيات مثل آلاء ستير، جلال يوسف، أسيل دياب، محمد كردفاني، هاجوج كوكا، يسرى البقير، ومحمد مطر.",
    },
    {
      key: "TRIBE_INTRO",
      titleEn: "Our Tribe",
      titleAr: "قبيلتنا",
      bodyEn: "Creators. Communication Artists. Curators. Punctual Beings. Sudanese creatives with 25+ years combined local & international experience (UK, Germany, Netherlands, Uganda, Kenya, Egypt). A proven track record of globalising Sudanese culture.",
      bodyAr: "مبدعون. فنّانو تواصل. أمينون. كائنات دقيقة المواعيد. مبدعون سودانيون بأكثر من 25 عامًا من الخبرة المحلية والدولية مجتمعة (المملكة المتحدة، ألمانيا، هولندا، أوغندا، كينيا، مصر). سجل حافل في عولمة الثقافة السودانية.",
    },
    {
      key: "SHOWREEL_URL",
      titleEn: "Showreel",
      titleAr: "عرض الأعمال",
      bodyEn: "https://drive.google.com/file/d/1bAEFVqsi8_0SiJE4XnH8O0x7MfzuOxfb/view",
      bodyAr: "https://drive.google.com/file/d/1bAEFVqsi8_0SiJE4XnH8O0x7MfzuOxfb/view",
    },
  ];

  for (const sc of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: sc.key },
      update: {},
      create: sc,
    });
  }

  // --- Services -----------------------------------------------------------
  const services: Array<{ nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; order: number }> = [
    { nameEn: "Concept & Content Creation", nameAr: "بناء المفاهيم والمحتوى", descriptionEn: "Original concepts tailored to your audience.", descriptionAr: "مفاهيم أصلية مصممة لجمهورك.", order: 0 },
    { nameEn: "Advertising Campaigns", nameAr: "الحملات الإعلانية", descriptionEn: "Full-funnel campaigns that move people.", descriptionAr: "حملات متكاملة تحرّك الجمهور.", order: 1 },
    { nameEn: "Digital Media Campaigns", nameAr: "حملات الوسائط الرقمية", descriptionEn: "Social-native, platform-aware storytelling.", descriptionAr: "سرد قصصي مولود للمنصات الاجتماعية.", order: 2 },
    { nameEn: "Creative Copywriting (AR & EN)", nameAr: "الكتابة الإبداعية (عربي وإنجليزي)", descriptionEn: "Bilingual craft that lands.", descriptionAr: "حرفة ثنائية اللغة تصيب الهدف.", order: 3 },
    { nameEn: "Graphic Design", nameAr: "التصميم الجرافيكي", descriptionEn: "Visual systems with soul.", descriptionAr: "أنظمة بصرية بروح.", order: 4 },
    { nameEn: "2D & Motion Graphics", nameAr: "موشن جرافيك وثنائي الأبعاد", descriptionEn: "Animation that explains and delights.", descriptionAr: "رسوم متحركة تشرح وتُسعد.", order: 5 },
    { nameEn: "Filmmaking & Videography", nameAr: "صناعة الأفلام والفيديو", descriptionEn: "TVCs, documentaries, social content, short films, music videos, explainer videos.", descriptionAr: "إعلانات تلفزيونية، وثائقيات، محتوى اجتماعي، أفلام قصيرة، فيديو كليبات، فيديوهات توضيحية.", order: 6 },
    { nameEn: "Photography", nameAr: "التصوير الفوتوغرافي", descriptionEn: "Stills with intention.", descriptionAr: "صور ثابتة بنية واضحة.", order: 7 },
    { nameEn: "Audio Production & Music", nameAr: "الإنتاج الصوتي والموسيقى", descriptionEn: "Composing, VOs, sound design, sound engineering, podcast, radio edits.", descriptionAr: "التلحين، التعليق الصوتي، تصميم الصوت، الهندرة الصوتية، البودكاست، التعديلات الإذاعية.", order: 8 },
    { nameEn: "Media Planning", nameAr: "تخطيط الوسائط", descriptionEn: "Right message, right channel, right time.", descriptionAr: "الرسالة الصحيحة، القناة الصحيحة، الوقت الصحيح.", order: 9 },
    { nameEn: "Experiential Marketing & Events", nameAr: "التسويق التجريبي والفعاليات", descriptionEn: "Memorable, buzz-worthy, PR-able experiences.", descriptionAr: "تجارب لا تُنسى وتصنع ضجيجًا وقابلة للعلاقات العامة.", order: 10 },
  ];
  await prisma.service.deleteMany({});
  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // --- Creative Process ---------------------------------------------------
  const steps = [
    "Communication Brief", "Brief Analysis & Research", "Client Debrief", "Brainstorming",
    "Project Timeline", "Creative Brief", "Creative Concept Development",
    "Client Presentation", "Concept Finalisation", "Concept Execution & Implementation",
  ];
  await prisma.processStep.deleteMany({});
  for (const [i, label] of steps.entries()) {
    await prisma.processStep.create({
      data: { labelEn: label, labelAr: label, order: i },
    });
  }

  // --- Production phases + equipment -------------------------------------
  await prisma.productionPhase.deleteMany({});
  const phases = [
    {
      nameEn: "Pre-Production", nameAr: "ما قبل الإنتاج", order: 0,
      bodyEn: "Director treatment, timeline, art direction, mood-board, location scouting, casting, shot list, content forms, audio production, PPM.",
      bodyAr: "معالجة المخرج، الجدول الزمني، التوجيه الفني، لوحة المزاج، اختيار المواقع، اختيار الممثلين، قائمة اللقطات، أشكال المحتوى، الإنتاج الصوتي، اجتماع ما قبل الإنتاج.",
    },
    {
      nameEn: "Production", nameAr: "الإنتاج", order: 1,
      bodyEn: "The shoot — after client approval.",
      bodyAr: "التصوير — بعد موافقة العميل.",
    },
    {
      nameEn: "Post-Production", nameAr: "ما بعد الإنتاج", order: 2,
      bodyEn: "Sound design, colour correction & grading, subtitles & translations, motion graphics, final delivery.",
      bodyAr: "تصميم الصوت، تصحيح وتدرير الألوان، الترجمة النصية والترجمة، الموشن جرافيك، التسليم النهائي.",
    },
  ];
  for (const p of phases) {
    await prisma.productionPhase.create({ data: p });
  }

  await prisma.equipmentItem.deleteMany({});
  const equipment = [
    "Sony FX30", "Canon C50", "Canon C70", "RED Raven",
    "Sony Alpha A7IV", "Sony Alpha A7V",
    "Lenses: 50mm prime → 70–200 telephoto",
    "Rode & Sennheiser microphones",
    "Aputure / Spark / LED (AP120, AP300)",
    "DJI Ronin stabilisers, rigs & mounts",
  ];
  for (const [i, label] of equipment.entries()) {
    await prisma.equipmentItem.create({
      data: { labelEn: label, labelAr: label, order: i },
    });
  }

  // --- Clients ------------------------------------------------------------
  await prisma.client.deleteMany({});
  const clients = [
    "UNICEF Sudan", "YouTube Creators for Change (Maha AJ)", "YouTube – Fly With Haifa (Sudan)",
    "WFP", "UN Women", "UNDP", "FAO", "Careem", "Omal Bank",
    "East Sudan Reconstruction Fund", "Viva Con Agua (Kampala)",
    "AlJazeera Documentary Channel", "SUDIA", "CTC Group / LG Sudan",
    "MSU / DAL Trading", "ZOA International",
  ];
  for (const [i, name] of clients.entries()) {
    await prisma.client.create({ data: { name, order: i } });
  }

  // --- Testimonials -------------------------------------------------------
  await prisma.testimonial.deleteMany({});
  const testimonials = [
    {
      quoteEn: "Professional, diligent… game changers and unmatched in Sudan.",
      quoteAr: "محترفون ومجتهدون… يغيّرون قواعد اللعبة ولا يُضاهَون في السودان.",
      authorName: "Fatma Naib",
      authorRoleEn: "Former Chief of Communication & Advocacy, UNICEF Sudan (2018–2022)",
      authorRoleAr: "رئيسة الاتصال والمناصرة السابقة، اليونيسف السودان (2018–2022)",
      org: "UNICEF", order: 0,
    },
    {
      quoteEn: "Extremely creative and disciplined… exceeded expectations… I am confident in recommending them.",
      quoteAr: "مبدعون للغاية ومنضبطون… تجاوزوا التوقعات… أثق في التوصية بهم.",
      authorName: "Lameese Badr",
      authorRoleEn: "Head of Communications, UNDP Sudan",
      authorRoleAr: "رئيسة الاتصالات، برنامج الأمم المتحدة الإنمائي السودان",
      org: "UNDP", order: 1,
    },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // --- Team (placeholder) -------------------------------------------------
  await prisma.teamMember.deleteMany({});
  await prisma.teamMember.create({
    data: {
      nameEn: "The NinetyNile Tribe",
      nameAr: "قبيلة ناينتي نايل",
      roleEn: "Sudanese Creatives",
      roleAr: "مبدعون سودانيون",
      bioEn: "Creators. Communication Artists. Curators. Punctual Beings. 25+ years combined experience across UK, Germany, Netherlands, Uganda, Kenya, and Egypt.",
      bioAr: "مبدعون. فنّانو تواصل. أمينون. كائنات دقيقة المواعيد. أكثر من 25 عامًا من الخبرة المجتمعة عبر المملكة المتحدة وألمانيا وهولندا وأوغندا وكينيا ومصر.",
      order: 0, status: Status.PUBLISHED,
    },
  });

  // --- Case studies (9) ---------------------------------------------------
  await prisma.caseStudy.deleteMany({});

  type SeedCS = {
    slug: string;
    titleEn: string; titleAr: string;
    clientEn: string; clientAr: string;
    summaryEn: string; summaryAr: string;
    challengeEn: string; challengeEn_body?: boolean;
    category: CaseStudyCategory;
    metrics: Metric[];
    externalLinks: ExternalLink[];
    order: number;
  };

  const caseStudies: SeedCS[] = [
    {
      slug: "sixty-light-seconds",
      titleEn: "Sixty Light Seconds", titleAr: "ستون ثانية ضوئية",
      clientEn: "NNL Original", clientAr: "إنتاج ناينتي نايل الأصلي",
      summaryEn: "A multi-episode show bridging generations through spontaneous dialogue with Sudanese figures.",
      summaryAr: "برنامج متعدد الحلقات يصل بين الأجيال عبر حوار عفوي مع شخصيات سودانية.",
      challengeEn: "Create an engaging short-form format that bridges generational divides on social platforms during Ramadan.",
      category: CaseStudyCategory.ORIGINAL,
      metrics: [
        { labelEn: "Views", labelAr: "مشاهدة", value: "600,000+" },
        { labelEn: "Interactions", labelAr: "تفاعل", value: "40,000+" },
      ],
      externalLinks: [
        { label: "Instagram", url: "https://instagram.com/reel/C4YxiVDObqZ" },
      ],
      order: 0,
    },
    {
      slug: "cradle-the-earth",
      titleEn: "Cradle the Earth", titleAr: "مهدة الأرض",
      clientEn: "UNDP", clientAr: "برنامج الأمم المتحدة الإنمائي",
      summaryEn: "A renewable-energy short film and UNDP Sudan's official COP27 2022 entry.",
      summaryAr: "فيلم قصير عن الطاقة المتجددة والمشاركة الرسمية لليونيسف السودان في COP27 2022.",
      challengeEn: "Communicate the urgency of renewable energy for Sudan on a global stage at COP27.",
      category: CaseStudyCategory.FILM,
      metrics: [
        { labelEn: "Views", labelAr: "مشاهدة", value: "20,000+" },
        { labelEn: "Accounts reached", labelAr: "حساب وصل", value: "27,000+" },
      ],
      externalLinks: [
        { label: "Instagram", url: "https://instagram.com/reel/Ck8eUcHoJKO" },
      ],
      order: 1,
    },
    {
      slug: "whats-the-sauce-bono",
      titleEn: "What's the Sauce? (Bono)", titleAr: "إيه الصوص؟ (بونو)",
      clientEn: "Bono", clientAr: "بونو",
      summaryEn: "A quirky TVC for the first 100% Sudanese chicken stock cube, aired Ramadan 2023.",
      summaryAr: "إعلان تلفزيوني طريف لأول مكعب مرق دجاج سوداني 100%، عُرض رمضان 2023.",
      challengeEn: "Launch a brand-new Sudanese product with a memorable, culturally resonant TVC.",
      category: CaseStudyCategory.TVC,
      metrics: [],
      externalLinks: [
        { label: "TikTok", url: "https://tiktok.com/@19ninetynile" },
      ],
      order: 2,
    },
    {
      slug: "tamam",
      titleEn: "Tamam", titleAr: "تمام",
      clientEn: "UNICEF", clientAr: "اليونيسف",
      summaryEn: "A music video for the International Day of the Girl Child simplifying the CRC.",
      summaryAr: "فيديو كليب بمناسبة اليوم الدولي للطفلة يبسّط اتفاقية حقوق الطفل.",
      challengeEn: "Make the Convention on the Rights of the Child accessible and memorable for young audiences.",
      category: CaseStudyCategory.MUSIC_VIDEO,
      metrics: [
        { labelEn: "Facebook views", labelAr: "مشاهدة فيسبوك", value: "565,000" },
        { labelEn: "People reached", labelAr: "شخص وصل", value: "1,512,270" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=IRxFuA2QPg0" },
      ],
      order: 3,
    },
    {
      slug: "hodana",
      titleEn: "Hodana", titleAr: "احضانا",
      clientEn: "UNICEF", clientAr: "اليونيسف",
      summaryEn: "A back-to-school campaign post-COVID, inspired by the lullaby 'Shilel Weanu'.",
      summaryAr: "حملة العودة للمدارس بعد كوفيد، مستوحاة من التهويدة «شيل وينو».",
      challengeEn: "Reassure families and children about returning to school after the pandemic.",
      category: CaseStudyCategory.MUSIC_VIDEO,
      metrics: [
        { labelEn: "Views", labelAr: "مشاهدة", value: "106,000" },
        { labelEn: "People reached", labelAr: "شخص وصل", value: "283,115" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=pnEELjKDgog" },
      ],
      order: 4,
    },
    {
      slug: "makhtoum",
      titleEn: "Makhtoum", titleAr: "مختوم",
      clientEn: "UNICEF", clientAr: "اليونيسف",
      summaryEn: "A documentary about Youth Advocate Makhtoum Abdalla from an IDP camp in Darfur.",
      summaryAr: "وثائقي عن المدافع الشبابي مختوم عبدالله من مخيم للنازحين في دارفور.",
      challengeEn: "Amplify the voice and achievements of a remarkable young advocate from Darfur.",
      category: CaseStudyCategory.DOCUMENTARY,
      metrics: [
        { labelEn: "TED subscribers", labelAr: "مشترك TED", value: "21.6M" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=iS4Bx2pmSlg" },
        { label: "YouTube", url: "https://youtube.com/watch?v=hVRN1rKq2v8" },
      ],
      order: 5,
    },
    {
      slug: "ayaam",
      titleEn: "Ayaam", titleAr: "أيام",
      clientEn: "Soulja | SVNBRDS", clientAr: "سولجا | إس‌في‌إن‌بي‌آر‌دي‌إس",
      summaryEn: "A guerilla-style music video on displacement after 15 April 2023.",
      summaryAr: "فيديو كليب بأسلوب حرب العصابات عن النزوح بعد 15 أبريل 2023.",
      challengeEn: "Tell the story of displacement with raw, urgent, guerilla-style filmmaking.",
      category: CaseStudyCategory.MUSIC_VIDEO,
      metrics: [
        { labelEn: "Views (1 month)", labelAr: "مشاهدة (شهر واحد)", value: "500,000+" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=JS6nXa5K2so" },
        { label: "YouTube", url: "https://youtube.com/watch?v=wAohE6VG6-c" },
      ],
      order: 6,
    },
    {
      slug: "digitech-lg-vivace",
      titleEn: "Digitech / LG Vivace", titleAr: "ديجيتك / إل‌جي فيفاسي",
      clientEn: "LG Sudan", clientAr: "إل‌جي السودان",
      summaryEn: "A TVC for a smart washing machine with 70s/80s nostalgia.",
      summaryAr: "إعلان تلفزيوني لغسالة ذكية بحنين السبعينيات والثمانينيات.",
      challengeEn: "Make a white-goods product launch feel joyful and culturally familiar.",
      category: CaseStudyCategory.TVC,
      metrics: [
        { labelEn: "Views", labelAr: "مشاهدة", value: "58,000+" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=-7k8HrT9iMk" },
      ],
      order: 7,
    },
    {
      slug: "salimmik",
      titleEn: "Salimmik", titleAr: "سلّميك",
      clientEn: "YouTube Creators for Change (Maha AJ)", clientAr: "يوتيوب صنّاع التغيير (مها أ.ج)",
      summaryEn: "A celebration of Sudan's nature and culture that reached millions.",
      summaryAr: "احتفاء بطبيعة السودان وثقافته وصل إلى الملايين.",
      challengeEn: "Showcase the beauty and richness of Sudanese nature and culture to a global audience.",
      category: CaseStudyCategory.FILM,
      metrics: [
        { labelEn: "Views", labelAr: "مشاهدة", value: "4,564,747" },
      ],
      externalLinks: [
        { label: "YouTube", url: "https://youtube.com/watch?v=JS6nXa5K2so" },
      ],
      order: 8,
    },
  ];

  for (const cs of caseStudies) {
    const data = {
      slug: cs.slug,
      titleEn: cs.titleEn,
      titleAr: cs.titleAr,
      clientEn: cs.clientEn,
      clientAr: cs.clientAr,
      summaryEn: cs.summaryEn,
      summaryAr: cs.summaryAr,
      challengeEn: cs.challengeEn,
      challengeAr: cs.challengeEn,
      solutionEn: "Crafted with our end-to-end creative process — from concept development to final delivery.",
      solutionAr: "صُنع بعمليتنا الإبداعية المتكاملة — من تطوير المفهوم حتى التسليم النهائي.",
      resultsEn: "The work resonated deeply with audiences and amplified the message far beyond expectations.",
      resultsAr: "لقي العمل صدى عميقًا لدى الجمهور وضخّم الرسالة إلى أبعد من المتوقع.",
      category: cs.category,
      metrics: cs.metrics,
      externalLinks: cs.externalLinks,
      order: cs.order,
      status: Status.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
    };
    await prisma.caseStudy.create({ data });
  }

  // --- Projects (a couple of additional portfolio items) ------------------
  await prisma.project.deleteMany({});
  const projects = [
    {
      slug: "unicef-kids-speech",
      titleEn: "Unicef Kids Speech", titleAr: "خطاب أطفال اليونيسف",
      descriptionEn: "Empowering young voices.", descriptionAr: "تمكين الأصوات الشابة.",
      order: 0,
    },
    {
      slug: "zoa-water-resources",
      titleEn: "ZOA Water Resources", titleAr: "موارد المياه - زوا",
      descriptionEn: "Documenting water access initiatives.", descriptionAr: "توثيق مبادرات الوصول إلى المياه.",
      order: 1,
    },
    {
      slug: "karmakol-international-festival",
      titleEn: "Karmakol International Festival", titleAr: "مهرجان كرمكول الدولي",
      descriptionEn: "Cultural festival coverage.", descriptionAr: "تغطية مهرجان ثقافي.",
      order: 2,
    },
  ];
  for (const p of projects) {
    await prisma.project.create({
      data: {
        ...p,
        status: Status.PUBLISHED,
        publishedAt: new Date(),
        authorId: editor.id,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log(`   Admin:  ${admin.email}`);
  console.log(`   Editor: ${editor.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
