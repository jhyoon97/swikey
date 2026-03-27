/**
 * 스위치 이미지 일괄 다운로드 + 최적화 스크립트
 * 사용법: node scripts/download-switch-images.mjs
 * 출력: public/images/switches/{slug}.webp (800px, quality 90)
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const OUT_DIR = resolve('public/images/switches');
mkdirSync(OUT_DIR, { recursive: true });

// slug → image source URL mapping
const IMAGES = {
  // AEBoards
  'aeboards-raeds-he': 'https://cannonkeys.com/cdn/shop/files/DSC03707_grande.jpg?v=1745613325',

  // Wooting
  'lekker-linear45-(l45)-v2': 'https://wooting-website.ams3.cdn.digitaloceanspaces.com/products/switches/l45_v2_OG.webp',
  'lekker-linear60-(l60)-v1': 'https://wooting-website.ams3.cdn.digitaloceanspaces.com/products/switches/l60_v1_OG.webp',
  'lekker-linear60-(l60)-v2': 'https://wooting-website.ams3.cdn.digitaloceanspaces.com/products/switches/l60_v2_OG.webp',
  'lekker-tikken-medium': 'https://wooting-website.ams3.cdn.digitaloceanspaces.com/products/switches/lekker-tikken/lekker-tikken-single-main.webp',

  // BSUN - Tactile
  'bsun-dustproof-blue': 'https://switchoddities.com/cdn/shop/products/BSUN_2BDustproof_2BBlue_2B1.jpg?v=1676979855',
  'bsun-blue': 'https://switchoddities.com/cdn/shop/products/BSUN_2BBlue_2B1.jpg?v=1676979848',
  'bsun-brown': 'https://switchoddities.com/cdn/shop/products/BSUN_2BBrown_2B1.jpg?v=1676979841',
  'bsun-red': 'https://switchoddities.com/cdn/shop/products/BSUN_2BRed_2B1.jpg?v=1676979827',
  'yok-bsun-smoky-black': 'https://kprepublic.com/cdn/shop/files/YOK-BSun-Smoky-Black-Switch-RGB-SMD-Tactile-Switch-For-Mechanical-keyboard-65g-Transparent-Black-Stem.jpg?v=1686887940',
  'bsun-dragon-fruit-(panda-v2)': 'https://res.cloudinary.com/milktooth/image/upload/v1708480954/switch-photos/Dragon%20Fruit/Dragon_Fruit_1_qkjott.jpg',
  'bsun-x-zuoce-cheese-grape': 'https://www.keebzncables.com/cdn/shop/files/Zuoce_Cheese_Grape_Product_WEB-1.jpg?v=1768547730',
  'bsun-cliff': 'https://res.cloudinary.com/milktooth/image/upload/v1719694868/switch-photos/Cliff/Cliff_1_at52xw.jpg',
  'bsun-sea-fog': 'https://unikeyboards.com/cdn/shop/files/DSC_2573.jpg?v=1727156743',
  'bsun-ocean': 'https://lumekeebs.com/cdn/shop/files/Untitled-2_e2cebb03-27a2-4101-89f1-b6f2ab0c488f.png',
  'bsun-mozzarella-cheese': 'https://divinikey.com/cdn/shop/files/bsun-mozzarella-cheese-tactile-switches-9168049.webp?v=1771072508',
  'bsun-strawberry-cheesecake': 'https://kukey.studio/cdn/shop/files/IMG_0872.webp?v=1725081696',
  'bsun-olive': 'https://mechanicalkeyboards.com/cdn/shop/files/23609-YC8ED-BSUN_OLV.jpg?v=1731534731',
  'bsun-ruben-hornet-tactile': 'https://kprepublic.com/cdn/shop/files/02_de102c98-214a-4107-9e3b-2181d1976e86.jpg?v=1748413933',
  'bsun-crystal-purple': 'https://kprepublic.com/cdn/shop/files/BSun-Crystal-Purple-Switch-RGB-SMD-Tactile-Switch-For-Mechanical-keyboard-38g-65g-Purple-POM-80M.jpg?v=1696925019',
  'bsun-clear': 'https://kprepublic.com/cdn/shop/files/S2d3224746d41407ba317fa71cee24552N.jpg_960x960q75.webp?v=1736233770',
  'bsun-hutt': 'https://mechanicalkeyboards.com/cdn/shop/files/24470-NAEP8-BSUN-Hutt-40g-Tactile-Switch.jpg?v=1740756004',
  'bsun-raw-tactile': 'https://keebsforall.com/cdn/shop/files/bsunraw_45d89c5a-a564-4eed-a66b-9d03e2b9edd8.webp?v=1702575219',
  'bsun-pine': 'https://divinikey.com/cdn/shop/products/bsun-pine-tactile-switches-337790.webp?v=1707582552',
  'bsun-holy-panda-v2': 'https://beaverkeys.ca/cdn/shop/files/resized_2200_x_20240610_0078.png?v=1718071893',
  'bsun-golden-apple': 'https://images.squarespace-cdn.com/content/v1/5e5af256556661723b861bd1/f7379b95-27b2-444d-9ccd-88e8dc4821f3/blwoout.JPG',

  // BSUN - Linear
  'yok-bsun-banana-white': 'https://kprepublic.com/cdn/shop/files/YOK-BSun-Banana-Switch-RGB-SMD-Tactile-Linear-Switch-For-Mechanical-keyboard-56g-MX-Stem-80M.jpg?v=1695872135',
  'yok-bsun-litchi': 'https://kprepublic.com/cdn/shop/files/YOK-BSun-Panda-Switch-RGB-SMD-Linear-Switch-Litchi-Switch-For-Mechanical-keyboard-65g-Milky-Housing.jpg?v=1686555705',
  'yok-bsun-pine-ash': 'https://kprepublic.com/cdn/shop/files/YOK-BSun-Panda-Switch-RGB-SMD-Linear-Switch-Dragon-Fruit-Avocado-Polaris-Pine-Ash-Primitive-White.jpg?v=1686205043',
  'bsun-x-zuoce-sweet-grape-fruit': 'https://www.keebzncables.com/cdn/shop/files/DSC0632.jpg?v=1753430798',
  'bsun-x-zuoce-macaron': 'https://www.keebzncables.com/cdn/shop/files/zuoce-studio-keyboard-switches-macaron-green-bsun-x-zuoce-studio-macaron-linear-switches-58187822498101.jpg?v=1745917172',
  'bsun-x-zuoce-marshmallow': 'https://lumekeebs.com/cdn/shop/files/Untitled-6_3d75f725-3b85-4daf-94dd-ba9284d7b268.png?v=1756334814',
  'bsun-x-zuoce-lavender': 'https://res.cloudinary.com/milktooth/image/upload/v1708892380/switch-photos/Lavender/Lavender_1_rcrvhd.jpg',
  'bsun-rise-tiramisu-45g': 'https://kprepublic.com/cdn/shop/files/Rise-Tiramisu-Switch-Linear-Switch-for-Gaming-Mechanical-Keyboard-35g-40g-45g-5pin-POM-PA-Y3.webp?v=1714028584',
  'bsun-chiikawa-45g': 'https://zkeebs.com/cdn/shop/files/bsun-chiikawa-linear-switches-502.jpg?v=1724',
  'bsun-k1-45g': 'https://lumekeebs.com/cdn/shop/files/1_774ae41f-d585-4d47-b01c-30d816be1f9d.png?v=1739612725',
  'bsun-ragdoll': 'https://res.cloudinary.com/milktooth/image/upload/v1727575143/switch-photos/Ragdoll/Ragdoll_1_goyarq.jpg',
  'bsun-akashi': 'https://lumekeebs.com/cdn/shop/files/1_256ebc30-f7a3-47d5-a07d-0e02eb92e54d.png?v=1745027978',
  'bsun-maple-sugar': 'https://unikeyboards.com/cdn/shop/files/zt00255.jpg?v=1734168114',
  'bsun-ruben-hornet-linear': 'https://kprepublic.com/cdn/shop/files/02_de102c98-214a-4107-9e3b-2181d1976e86.jpg?v=1748413933',
  'bsun-snow-diane': 'https://unikeyboards.com/cdn/shop/files/6_ef9da42c-a541-4e4b-b322-e338d110d7ff.jpg?v=1722822849',
  'bsun-kiki-red': 'https://res.cloudinary.com/milktooth/image/upload/v1708482150/switch-photos/Kiki%20Red/Kiki_Red_1_i02mxt.jpg',
  'bsun-guyu': 'https://divinikey.com/cdn/shop/products/bsun-guyu-linear-switches-652280.webp?v=1686975231',
  'everglide-bsun-sunset-yellow': 'https://kprepublic.com/cdn/shop/files/Everglide-BSun-Sunset-Yellow-Switch-RGB-SMD-Linear-51g-Switches-For-Mechanical-keyboard-MX-Stem-5pin.jpg?v=1693623001',
  'bsun-rise-dream-42g': 'https://keybumps.com/img/switch/bsun-rise-dream.jpg',
  'bsun-buzz-42g': 'https://kprepublic.com/cdn/shop/files/BSun-Buzz-Switch-RGB-SMD-Linear-Switch-For-Gaming-Mechanical-keyboard-37g-42g-POM-LY-Long.webp?v=1721717010',
  'bsun-pop': 'https://kprepublic.com/cdn/shop/files/BSun-POP-Switch-RGB-SMD-Pre-Advanced-Tactile-Switch-For-Mechanical-keyboard-50g-Modified-LY-Stem.jpg?v=1690360129',
  'bsun-jade-rosales': 'https://mechanicalkeyboards.com/cdn/shop/files/24471-GGW4D-BSUN-Jade-Rosales-45g-Linear-Switch.jpg?v=1740757265',
  'bsun-dragon-42g': 'https://mechanicalkeyboards.com/cdn/shop/files/24107-WX183-BSUN-Dragon-Linear-PCB-Mount-Switch.jpg?v=1738182004',
  'bsun-bubble-v2': 'https://mech.land/cdn/shop/files/bubble-v2.jpg?v=1707983058',
  'bsun-bubble': 'https://mechanicalkeyboards.com/cdn/shop/files/23611-FF9YJ-BSUN_BBL.jpg?v=1731534785',
  'bsun-light-sakura-silent': 'https://mechanicalkeyboards.com/cdn/shop/files/23608-YJXYT-BSUN-Sakura-37g-Linear-PCB-Mount.jpg?v=1731534724',
  'bsun-bunny-(tuzi)': 'https://res.cloudinary.com/milktooth/image/upload/v1708892861/switch-photos/Tuzi%20%28Bunny%29/Tuzi_1_rwppno.jpg',
  'bsun-milk-tea-siam-v2': 'https://switchoddities.com/cdn/shop/files/MilkTea21.jpg?v=1723254978',
  'bsun-milk-tea-siam': 'https://dangkeebs.com/cdn/shop/files/BsunMilkTeaSiam.jpg?v=1692813807',
  'bsun-milk-dragon': 'https://lumekeebs.com/cdn/shop/files/1_611e0a56-d07f-46d5-a6c1-79d3017fd8c3.png?v=1747769505',
  'bsun-dusty-rose': 'https://lumekeebs.com/cdn/shop/files/1_f384eca3-63b6-4218-b13f-05aca4588a4d.png?v=1743555117',
  'bsun-raw-linear-60g': 'https://divinikey.com/cdn/shop/files/bsun-raw-linear-switches-166008.webp?v=1733977938',
  'bsun-tai-chi': 'https://divinikey.com/cdn/shop/files/bsun-tai-chi-linear-switches-663843.webp?v=1715378485',
  'bsun-aniya-r2-45g': 'https://chosfox.com/cdn/shop/files/1_89702e94-873d-4e29-ad63-aca047e5b836.png?v=1711605480',
  'bsun-agarwood': 'https://images.squarespace-cdn.com/content/v1/5e5af256556661723b861bd1/a918dd8e-632b-4bff-b4c7-2dfe2bc49e6a/blowout.JPG',
  'bsun-flower-shadow-v2': 'https://res.cloudinary.com/kineticlabs/image/upload/q_auto/c_fit,w_1300/f_auto/v1/api-images/products/flower-shadow-switches/v2/DSC05265_monghu',
  'bsun-x-v1': 'https://assets.bigcartel.com/product_images/380073054/1_bf5b4277-150a-4366-9eef-fe7012007137.webp?auto=format&fit=max&h=1200&w=1200',

  // Cherry
  'cherry-mx2a-blue': 'https://www.cherry.de/fileadmin/_processed_/b/8/csm_1526c62f1b5f26bb8d715cebd2067254_c219072656.jpg',
  'cherry-mx-white': 'https://keybumps.com/img/switch/cherry-mx-white.jpg',
  'cherry-mx-green': 'https://keybumps.com/img/switch/cherry-mx-green.jpg',
  'cherry-mx-blue': 'https://keebworks.com/wp-content/uploads/2020/08/Cherry-MX-Blue-Feature-Image-scaled.jpg',
  'cherry-mx-falcon': 'https://www.cherry.de/fileadmin/_processed_/9/0/csm_0b7d22f90f2e8adb7ab8cf13089c3ec9_9b32a7fccb.jpg',
  'cherry-mx2a-honey': 'https://www.cherry.de/fileadmin/_processed_/e/d/csm_a4ecf75e1a20983f76bf2ed460124109_6b24da64ce.jpg',
  'cherry-mx2a-petal': 'https://divinikey.com/cdn/shop/files/cherry-mx2a-petal-light-tactile-switches-9697158.webp?v=1774100291',
  'cherry-mx2a-purple': 'https://keybumps.com/img/switch/cherry-mx2a-purple.jpg',
  'cherry-mx2a-brown': 'https://www.cherry.de/fileadmin/_processed_/b/c/csm_b769943fc795183efec9a7c332955772_207c41813c.jpg',
  'cherry-mx-grey-tactile': 'https://www.cherry.de/fileadmin/_processed_/b/2/csm_cb1036c5254188f25f50628fc605b76e_b57bd8d01b.jpg',
  'cherry-mx-ergo-clear': 'https://keybumps.com/img/switch/cherry-mx-ergo-clear.jpg',
  'cherry-mx-clear': 'https://keybumps.com/img/switch/cherry-mx-clear.jpg',
  'cherry-mx-brown-hyperglide': 'https://keebsforall.com/cdn/shop/files/Cherry_HYPERGLIDE_BROWN_TOP_1cd8a76f-281e-4c3a-8520-cf4dbacb276e.png?v=1702575820',
  'cherry-mx-brown': 'https://keybumps.com/img/switch/cherry-mx-brown.jpg',
  'cherry-mx2a-northern-light': 'https://cherryxtrfy.com/wp/wp-content/uploads/2025/04/01_CHERRY_MX-Norhtern-Light-hero_edit.jpg',
  'cherry-mx2a-orange': 'https://keybumps.com/img/switch/cherry-mx2a-orange.jpg',
  'cherry-mx2a-silent-black': 'https://www.cherry.de/fileadmin/_processed_/4/2/csm_618d7e742ba41ad194fe5049fe8ecaae_d00f506de6.jpg',
  'cherry-mx2a-silent-red': 'https://keybumps.com/img/switch/cherry-mx2a-silent-red.jpg',
  'cherry-mx2a-speed-silver': 'https://keybumps.com/img/switch/cherry-mx2a-speed-silver.jpg',
  'cherry-mx2a-black': 'https://keybumps.com/img/switch/cherry-mx2a-black.jpg',
  'cherry-mx2a-red': 'https://keybumps.com/img/switch/cherry-mx2a-red.jpg',
  'cherry-mx-low-profile-speed-silver': 'https://www.cherry.de/fileadmin/_processed_/c/8/csm_0c12524768ec0b5b2393e44a0e5f02fe_339eefd712.jpg',
  'cherry-mx-low-profile-red': 'https://keybumps.com/img/switch/cherry-mx-low-profile-red.jpg',
  'cherry-mx-silent-black': 'https://keybumps.com/img/switch/cherry-mx-silent-black.jpg',
  'cherry-mx-silent-red': 'https://keybumps.com/img/switch/cherry-mx-silent-red.jpg',
  'cherry-mx-speed-silver': 'https://keybumps.com/img/switch/cherry-mx-speed-silver.jpg',
  'cherry-mx-grey-linear': 'https://mechanicalkeyboards.com/cdn/shop/files/4944-RBT3R-Cherry-MX-Grey-Linear-Switch.png?v=1707268089',
  'cherry-mx-nature-white': 'https://keybumps.com/img/switch/cherry-mx-nature-white.jpg',
  'cherry-mx-black-clear-top-(nixie)': 'https://www.cherry.de/fileadmin/_processed_/a/a/csm_68e359798d18a3ed1e4dc9ecd4b0496a_1a37b5933e.jpg',
  'cherry-mx-black-hyperglide': 'https://keybumps.com/img/switch/cherry-mx-black-hyperglide.jpg',
  'cherry-mx-black': 'https://keybumps.com/img/switch/cherry-mx-black.jpg',
  'cherry-mx-red-hyperglide': 'https://res.cloudinary.com/kineticlabs/image/upload/q_auto/c_fit,w_1300/f_auto/v1/api-images/products/cherry-hyperglide/DSC06232_tv0hpz',
  'cherry-mx-red': 'https://keybumps.com/img/switch/cherry-mx-red.jpg',

  // DrunkDeer
  'drunkdeer-raesha-silent': 'https://drunkdeer.com/cdn/shop/files/2_5526dfc2-38bb-433b-aba5-6a0f7033aca9.jpg?v=1739952956',
  'drunkdeer-raesha-linear': 'https://drunkdeer.com/cdn/shop/files/2_5526dfc2-38bb-433b-aba5-6a0f7033aca9.jpg?v=1739952956',

  // Gateron - HE/Magnetic
  'gateron-low-profile-magnetic-jade-pro': 'https://nuphy.com/cdn/shop/files/cc2b1cee89a4e3c3b35d4aaaa8ab4f6.jpg?v=1744133957',
  'gateron-magnetic-genty-silent': 'https://divinikey.com/cdn/shop/files/gateron-magnetic-genty-semi-silent-he-switches-150300.webp?v=1737126760',
  'gateron-magnetic-spark': 'https://mechanicalkeyboards.com/cdn/shop/files/25991-XUQU9-Gateron-Spark-Magnetic-Switch.jpg?v=1754580965',
  'gateron-magnetic-jade-ruby': 'https://mechanicalkeyboards.com/cdn/shop/files/25236-51KG9-Gateron-Magnetic-Jade-Ruby-Switch.jpg?v=1756157424',
  'gateron-magnetic-jade-sapphire': 'https://mechanicalkeyboards.com/cdn/shop/files/26443-D69BJ-Gateron-Magnetic-Jade-Sapphire-Switch.jpg?v=1759847660',
  'gateron-magnetic-jade-air': 'https://mechanicalkeyboards.com/cdn/shop/files/25586-8VED2-Gateron-Magnetic-Jade-Air-Switch.jpg?v=1749659766',
  'gateron-magnetic-jade-delta-dark': 'https://images.squarespace-cdn.com/content/v1/5e5af256556661723b861bd1/4317f7c3-23bb-418f-9fb1-c3b8b13e92c4/blowout.JPG',
  'gateron-magnetic-jade-delta-light': 'https://mechanicalkeyboards.com/cdn/shop/files/26599-TZ2IM-Gateron-Magnetic-Jade-Delta-Switch.jpg?v=1765310068',
  'gateron-magnetic-jade-ultra': 'https://mechanicalkeyboards.com/cdn/shop/files/26597-1U7H5-Gateron-Magnetic-Jade-Ultra-HE-Plate-Mount-Switch.jpg?v=1770325630',
  'gateron-magnetic-jade-pro-dual-smd': 'https://kbdfans.com/cdn/shop/files/2ffa170a-cc8d-43c0-9382-d473b824ac8a.png?v=1764225207',
  'gateron-magnetic-jade-pro': 'https://cannonkeys.com/cdn/shop/files/DSC02802_grande.jpg?v=1739830077',
  'gateron-magnetic-jade': 'https://divinikey.com/cdn/shop/products/gateron-magnetic-jade-linear-switches-252753.webp?v=1707996759',
  'gateron-nebula-(ks-37b)': 'https://mechanicalkeyboards.com/cdn/shop/files/18806-EI6PW-Gateron-Magnetic-Nebula.jpg?v=1729538286',
  'gateron-ks-37b-(fox)': 'https://lumekeebs.com/cdn/shop/files/1_8fbf8e22-c037-49dd-a8f3-5ede7d32964a.png?v=1719955081',
  'gateron-ks-20u-dual-rail-orange': 'https://halleffectcontroller.com/wp-content/uploads/2024/03/DSC01829.jpg',
  'gateron-ks-20-orange': 'https://mechanicalkeyboards.com/cdn/shop/files/17663-KWFK7-Gateron-KS-20-Orange-50g-Linear-Magnetic-HE-Switch.jpg?v=1714160827',
  'gateron-ks-20-white': 'https://mechkeys.com/cdn/shop/products/gateron-ks-20-magnetic-hall-sensor-switches-mechkeysshop-ks-20-orange-10-pcs-426762.png?v=1756556680',

  // Gateron - Clicky
  'gateron-ink-v2-blue': 'https://mechanicalkeyboards.com/cdn/shop/files/4640-CWRS5-Gateron-Ink-Blue-V2-Switches-Clicky.jpg?v=1725485130',
  'gateron-g-pro-30-blue': 'https://www.gateron.co/cdn/shop/files/Gateron-G-Pro-3.0-Red-Switch-Set.jpg?v=1683342544',
  'gateron-harmonic': 'https://divinikey.com/cdn/shop/files/gateron-harmonic-clicky-switches-5791743.webp?v=1769639539',
  'gateron-melodic': 'https://divinikey.com/cdn/shop/products/gateron-melodic-clicky-switches-922314.webp?v=1708079632',

  // Gateron - Tactile
  'gateron-x-siliworks-type-r': 'https://divinikey.com/cdn/shop/files/gateron-x-siliworks-type-r-tactile-switches-7723455.webp?v=1759320703',
  'gateron-silent-brown': 'https://mechanicalkeyboards.com/cdn/shop/files/5284-2KGBF-Gateron-Silent-Brown-55g-Tactile.jpg?v=1724773457',
  'gateron-lanes': 'https://images.squarespace-cdn.com/content/v1/5e5af256556661723b861bd1/04bae951-6bae-496e-a8cd-f005aee68800/blowout.JPG',
  'gateron-cap-v2-milky-brown': 'https://mechanicalkeyboards.com/cdn/shop/files/14647_636ac84915d79_Gateron-Cap-V2-Milky-Brown-Keyswitch-PCB-Mount-Tactile.jpg?v=1707266345',
  'gateron-pom-smoothie-chocolate': 'https://mechanicalkeyboards.com/cdn/shop/files/26446-T23N2-Gateron-Full-POM-Chocolate-Smoothie-Switch.jpg?v=1759853605',
  'gateron-longjing-tea': 'https://divinikey.com/cdn/shop/files/gateron-longjing-tea-tactile-switches-649024.webp?v=1737126757',
  'gateron-azure-dragon-v4': 'https://divinikey.com/cdn/shop/files/gateron-azure-dragon-v4-tactile-switches-7776550.webp?v=1758301186',
  'gateron-green-apple': 'https://divinikey.com/cdn/shop/files/gateron-green-apple-tactile-switches-522034.webp?v=1730373198',
  'gateron-ef-grayish': 'https://divinikey.com/cdn/shop/products/gateron-ef-grayish-tactile-switches-905839.webp?v=1705593835',
  'gateron-mini-i': 'https://divinikey.com/cdn/shop/products/gateron-mini-i-tactile-switch-328284.webp?v=1699628005',
  'gateron-quinn': 'https://divinikey.com/cdn/shop/products/gateron-quinn-tactile-switches-645174.webp?v=1690264768',
  'gateron-beer': 'https://divinikey.com/cdn/shop/products/gateron-beer-tactile-switches-174281.webp?v=1692253320',
  'gateron-baby-kangaroo-20': 'https://divinikey.com/cdn/shop/products/gateron-baby-kangaroo-20-tactile-switches-384510.webp?v=1696313533',
  'gateron-g-pro-30-brown': 'https://mechanicalkeyboards.com/cdn/shop/files/18764-LHA7P-Gateron-G-Pro-30-Brown-55g-Tactile-PCB-Mount.jpg?v=1711554676',

  // Gateron - Linear
  'swagkeys-x-gateron-deepping': 'https://divinikey.com/cdn/shop/files/swagkeys-x-gateron-deepping-linear-switches-356285.webp?v=1714633314',
  'gateron-everfree-dark-one': 'https://unikeyboards.com/cdn/shop/files/ZT00283.jpg?v=1736403717',
  'gateron-everfree-curry': 'https://cannonkeys.com/cdn/shop/files/Hero_82c18d40-0412-45b0-858c-3b3c5bf6a0af_grande.jpg?v=1739830088',
  'gateron-silent-black': 'https://mechanicalkeyboards.com/cdn/shop/files/1694-Y7LX3-Gateron-Silent-Black-60g-Linear-Plate-Mount-Switch.jpg?v=1724872598',
  'gateron-silent-red': 'https://mechanicalkeyboards.com/cdn/shop/files/1696-Z7TV8-Gateron-Silent-Red-Switches-Plate-Mount-Linear.png?v=1725460172',
  'gateron-cm': 'https://cannonkeys.com/cdn/shop/files/GateronCM-1_grande.jpg?v=1739830068',
  'gateron-x': 'https://cannonkeys.com/cdn/shop/files/DSC04555_grande.jpg?v=1749586941',
  'gateron-milky-yellow': 'https://keybumps.com/img/switch/gateron-milky-yellow.jpg',
  'gateron-cap-anniversary': 'https://mechanicalkeyboards.com/cdn/shop/files/17961-K9Z2C-Gateron-CAP-Anniversary-Switch.png?v=1708711895',
  'gateron-cap-v2-milky-yellow': 'https://mechanicalkeyboards.com/cdn/shop/files/14646_636ac848c75b9_Gateron-Cap-V2-Milky-Yellow-Keyswitch-PCB-Mount-Linear.jpg?v=1707266344',
  'gateron-ks-3-milky-red-pro': 'https://mechanicalkeyboards.com/cdn/shop/files/1432-HU1YQ-Gateron-Milky-Red-Switches-Plate-Mount-Linear.png?v=1707273185',
  'gateron-ks-3-milky-yellow-pro': 'https://divinikey.com/cdn/shop/products/gateron-ks-3-milky-yellow-pro-linear-switches-504850.jpg?v=1631230716',
  'gateron-g-pro-30-silver': 'https://mechanicalkeyboards.com/cdn/shop/files/18767-9J96E-Gateron-G-Pro-30-Silver-45g-Linear-PCB-Mount.jpg?v=1711555416',
  'gateron-g-pro-30-white': 'https://www.gateron.co/cdn/shop/files/Gateron-G-Pro-3.0-Red-Switch-Set.jpg?v=1683342544',
  'gateron-g-pro-30-black': 'https://www.gateron.co/cdn/shop/files/Gateron-G-Pro-3.0-Red-Switch-Set.jpg?v=1683342544',
  'gateron-g-pro-30-yellow': 'https://mechanicalkeyboards.com/cdn/shop/files/18766-6K6QU-Gateron-G-Pro-30-Yellow-50g-Linear-PCB-Mount.jpg?v=1711555189',
  'gateron-g-pro-30-red': 'https://mechanicalkeyboards.com/cdn/shop/files/18765-GKBCC-Gateron-G-Pro-30-Red-45g-Linear-PCB-Mount.jpg?v=1711554734',
  'gateron-lunar-probe': 'https://divinikey.com/cdn/shop/products/gateron-lunar-probe-linear-switches-201437.webp?v=1709902546',
  'gateron-zero-degree-0': 'https://divinikey.com/cdn/shop/files/gateron-zero-degree-00-silent-linear-switches-835930.webp?v=1714135739',
  'gateron-lemon-seabreeze': 'https://divinikey.com/cdn/shop/files/gateron-lemon-seabreeze-linear-switches-2573516.webp?v=1754786415',
  'gateron-sea-salt-smoothie': 'https://divinikey.com/cdn/shop/files/gateron-sea-salt-smoothie-linear-switches-297191.webp?v=1723001829',
  'gateron-pom-mint-smoothie': 'https://mechanicalkeyboards.com/cdn/shop/files/26445-L5WG2-Gateron-Full-POM-Mint-Silent-Smoothie-Switch.jpg?v=1759853596',
  'gateron-pom-smoothie-banana': 'https://mechanicalkeyboards.com/cdn/shop/files/26447-7KUGU-Gateron-Full-POM-Banana-Smoothie-Switch.jpg?v=1759853613',
  'gateron-pom-smoothie-strawberry': 'https://mechanicalkeyboards.com/cdn/shop/files/26444-AZB89-Gateron-Full-POM-Strawberry-Smoothie-Switch.jpg?v=1759853587',
  'gateron-smoothie-silver': 'https://divinikey.com/cdn/shop/files/gateron-smoothie-silver-linear-switches-218902.webp?v=1714135662',
  'gateron-smoothie': 'https://divinikey.com/cdn/shop/products/gateron-smoothie-linear-switches-801925.webp?v=1708079632',
  'gateron-khonsu': 'https://divinikey.com/cdn/shop/files/gateron-khonsu-linear-switches-5634297.webp?v=1758739576',
  'gateron-baby-raccoon': 'https://www.gateron.co/cdn/shop/products/Gateron-Baby-Racoon-Linear-Switch-Set.jpg?v=1667531201',
  'gateron-jupiter-red': 'https://www.gateron.co/cdn/shop/files/Gateron-Jupiter-Red-Switch-Set.jpg?v=1691738814',
  'gateron-box-cj': 'https://www.gateron.co/cdn/shop/products/Gateron-Box-CJ-Linear-Switch-Set.jpg?v=1657358572',
  'gateron-cj-dark-blue': 'https://www.gateron.co/cdn/shop/products/Gateron-CJ-Linear-Switch-Set-Light-Blue.jpg?v=1657358471',
  'gateron-cj-light-blue': 'https://divinikey.com/cdn/shop/products/gateron-cj-linear-switches-999313.jpg?v=1635297021',
  'gateron-box-ink-v2-pink': 'https://mechanicalkeyboards.com/cdn/shop/files/14643_636ac847bcdd4_Gateron-Ink-BOX-V2-Pink-Keyswitch-PCB-Mount-Linear.jpg?v=1707266290',
  'gateron-box-ink-v2-black': 'https://www.gateron.co/cdn/shop/products/Gateron-Box-Ink-Pink-V2-Switch-Set.jpg?v=1657359756',
  'gateron-ink-v2-pro-black': 'https://divinikey.com/cdn/shop/files/gateron-ink-v2-pro-black-linear-switches-985257.webp?v=1747775310',
  'gateron-ink-v2-silent-black': 'https://kbdfans.com/cdn/shop/products/1_e9a6f0ea-3a46-4d5b-abd5-fa7b27b0a1fd.jpg?v=1646035620',
  'gateron-ink-v2-yellow': 'https://res.cloudinary.com/kineticlabs/image/upload/q_auto/c_fit,w_1300/f_auto/v1/api-images/products/ink-v2/4-gateron-ink-v2-black-switches_jvpcly',
  'gateron-ink-v2-red': 'https://mechanicalkeyboards.com/cdn/shop/files/4642-X3PKZ-Gateron-Ink-Red-V2-Switches-Linear.jpg?v=1725485574',
  'gateron-ink-v2-black': 'https://divinikey.com/cdn/shop/products/gateron-ink-switches-v2-550646.jpg?v=1635297021',
  'gateron-oil-king': 'https://divinikey.com/cdn/shop/products/gateron-oil-king-linear-switches-389141.jpg?v=1642045846',
  'gateron-north-pole-20-box-red': 'https://www.gateron.co/cdn/shop/products/Gateron-North-Pole-2.0-Red-Switch_82b0d7cb-c821-49fe-ac39-9866c1c8b52b.jpg?v=1685609518',
};

// Variants that share the same image (slug → source slug)
const COPIES = {
  'bsun-rise-tiramisu-40g': 'bsun-rise-tiramisu-45g',
  'bsun-rise-tiramisu-35g': 'bsun-rise-tiramisu-45g',
  'bsun-chiikawa-37g': 'bsun-chiikawa-45g',
  'bsun-chiikawa-28g': 'bsun-chiikawa-45g',
  'bsun-dragon-33g': 'bsun-dragon-42g',
  'bsun-raw-linear-50g': 'bsun-raw-linear-60g',
  'bsun-raw-linear-40g': 'bsun-raw-linear-60g',
  'bsun-aniya-r2-28g': 'bsun-aniya-r2-45g',
  'bsun-buzz-37g': 'bsun-buzz-42g',
  'bsun-k1-37g': 'bsun-k1-45g',
  'yok-bsun-avocado': 'yok-bsun-pine-ash',
  'yok-bsun-polaris': 'yok-bsun-pine-ash',
  'yok-bsun-banana-black': 'yok-bsun-banana-white',
  'bsun-rise-dream-37g': 'bsun-rise-dream-42g',
  // Gateron shared variants
  'gateron-jupiter-banana': 'gateron-jupiter-red',
  'gateron-jupiter-brown': 'gateron-jupiter-red',
  'gateron-north-pole-20-box-brown': 'gateron-north-pole-20-box-red',
  'gateron-north-pole-20-box-silver': 'gateron-north-pole-20-box-red',
  'gateron-north-pole-20-yellow': 'gateron-north-pole-20-box-red',
};

async function downloadAndConvert(slug, url) {
  const dest = resolve(OUT_DIR, `${slug}.webp`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outBuf = await sharp(buf)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();
    writeFileSync(dest, outBuf);
    return true;
  } catch (e) {
    console.error(`FAIL: ${slug} - ${e.message}`);
    return false;
  }
}

async function main() {
  const entries = Object.entries(IMAGES);
  console.log(`Downloading ${entries.length} images...`);

  let ok = 0, fail = 0;
  // Process in batches of 10
  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(([slug, url]) => downloadAndConvert(slug, url))
    );
    results.forEach(r => r ? ok++ : fail++);
    process.stdout.write(`  ${ok + fail}/${entries.length}\r`);
  }

  console.log(`\nDownloaded: ${ok} OK, ${fail} failed`);

  // Copy variants
  let copied = 0;
  for (const [dest, src] of Object.entries(COPIES)) {
    const srcPath = resolve(OUT_DIR, `${src}.webp`);
    const destPath = resolve(OUT_DIR, `${dest}.webp`);
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      copied++;
    } else {
      console.error(`COPY FAIL: ${dest} (source ${src} missing)`);
    }
  }
  console.log(`Copied: ${copied} variants`);
  console.log(`Total: ${ok + copied} images in ${OUT_DIR}`);
}

main().catch(console.error);
