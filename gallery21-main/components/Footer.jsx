// import Image from "next/image";
// import { useTheme } from "next-themes";
// import styles from "../styles/Footer.module.css"; 
// import images from "../assets";
// import Button from "./Button";

// const FooterLinks = ({ heading, items }) => (
//   <div className={styles.footerLinks}>
//     <h3>{heading}</h3>
//     {items.map((item, index) => (
//       <p key={index}>{item}</p>
//     ))}
//   </div>
// );

// const Footer = () => {
//   const { theme } = useTheme();

//   return (
//     <footer className={styles.footer}>
//       <div className={styles.footerLinksWrapper}>
//         <div className={styles.emailUpdates}>
//           <h3>Get the latest updates</h3>
//           <input type="email" placeholder="Your Email" />
//           <Button btnName="Email me" btnType="primary" classStyles="rounded-md" />
//         </div>

//         <FooterLinks heading="Gallery21" items={["Explore", "How it Works", "Contact Us"]} />
//         <FooterLinks heading="Support" items={["Help Center", "Terms of service", "Legal", "Privacy policy"]} />
//       </div>

//       <div className={styles.footerBottom}>
//         <p>© 2024 Gallery21, All Rights Reserved</p>
//         <div className={styles.socialIcons}>
//           {images.map((image, index) => (
//             <Image
//               key={index}
//               src={image}
//               alt="social icon"
//               width={32}
//               height={32}
//               className={theme === "light" ? styles.invert : ""}
//             />
//           ))}
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
