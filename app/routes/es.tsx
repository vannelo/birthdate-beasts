import { type MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "../css/tailwind.css";
import app from "../css/app.css";
import { images } from "../utils/constants";
import { motion } from "framer-motion";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: app },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Birthdate Beasts" },
    { name: "description", content: "Discover your animal alter ego!" },
  ];
};

export default function Index() {
  const [bgImage, setBgImage] = useState(images.Image1);
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [day, setDay] = useState<any>(null);
  const [month, setMonth] = useState<any>(null);
  const [year, setYear] = useState<any>(null);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [language, setLanguage] = useState("es");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audio, setAudio] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [filesCount, setFilesCount] = useState(0);

  useEffect(() => {
    async function fetchFiles() {
      const response = await fetch("/files");
      const fileList = await response.json();
      setFiles(fileList);
    }

    fetchFiles();
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      setFilesCount(files.length);
    }
  }, [files]);

  const handleStart = () => {
    setPage((prev) => prev + 1);
    if (audio) {
      const prevValue = isPlaying;
      setIsPlaying(!prevValue);
      audio.play();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // if inputs are empty
    if (!email || !day || !month || !year) {
      setLoading(false);
      setError(true);
      return;
    }

    // get IP
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;

    // post to AI
    const response = await fetch("/animals", {
      method: "POST",
      body: JSON.stringify({ email, date, ip }),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();

    const {
      success,
      user: { imageUrl },
      description,
    } = data;
    if (success) {
      setSuccess(true);
      setImageUrl(imageUrl);
      setDescription(description);
      setLoading(false);
    }
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valueNumber = Number(event.target.value);
    setDay(valueNumber);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setMonth(value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setYear(value);
  };

  useEffect(() => {
    if (day && month && year) {
      setEnableSubmit(true);
      const date = `${month}-${day}-${year}`;
      setDate(date);
    }
  }, [day, month, year]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImage = Math.floor(Math.random() * filesCount) + 1;
      setBgImage(files[randomImage].name);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audioInstance = new Audio("/music.mp3");
    setAudio(audioInstance);
  }, []);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setIsMobileDevice(true);
    }
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {page === 0 && (
        <div className="language-switcher fixed top-0 right-0 p-4 z-10 text-white gap-1 flex text-sm">
          <a
            href="/"
            className={`${language === "en" ? "text-white " : "text-gray-500"}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </a>
          /
          <a
            href="/es"
            className={`${language === "es" ? "text-white " : "text-gray-500"}`}
            onClick={() => setLanguage("es")}
          >
            ES
          </a>
        </div>
      )}
      {page === 4 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
          >
            <div
              className="ken-burns fixed z-0 w-full h-full"
              style={{
                backgroundImage: `url(https://birthdate-beasts-s3.s3.amazonaws.com/${bgImage})`,
              }}
            />
            <div
              className={`fixed z-1 w-full h-full bg-black ${
                success ? "bg-opacity-75" : "bg-opacity-40"
              }`}
            />
          </motion.div>
        </>
      )}
      <div className="fixed z-2 w-full h-full">
        {page === 0 && (
          <div className="content flex flex-col items-center justify-center h-full p-20 max-w-[1000px] mx-auto gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3 }}
            >
              {isMobileDevice ? (
                <h1 className="text-5xl md:text-8xl text-center text-white font-bold drop-shadow-[0_35px_35px_rgba(255,255,255,1)]">
                  Birthdate Beasts AI
                </h1>
              ) : (
                <h1 className="nabla-heading text-5xl md:text-8xl text-center">
                  Birthdate Beasts AI
                </h1>
              )}
              <h2 className="text-white text-center my-4 text-lg">
                Descubre Tu Alter-Ego Animal
              </h2>
              <div className="flex flex-col items-center justify-center gap-4">
                <button
                  className="text-white font-bold text-xl py-2 px-8 border-2 border-white rounded-full my-4 hover:bg-white hover:text-black"
                  onClick={handleStart}
                >
                  COMENZAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {page === 1 && (
          <div className="content flex flex-col items-center justify-center h-full max-w-[1000px] mx-auto gap-4 text-white p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3 }}
            >
              <p>
                Bienvenido a Birthday Beasts AI, donde fusionamos lo místico con
                el reino animal para ofrecerte una visión de tu espíritu animal
                en una vida pasada. ¿Alguna vez te has preguntado si tu alma
                lleva la sabiduría de un búho, la fuerza de un león o la
                libertad de un águila? Nuestra experiencia única hace un puente
                entre esta curiosidad y tu fecha de nacimiento para desvelar qué
                animal fuiste en otra vida.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, delay: 3 }}
            >
              <button onClick={() => setPage((prev) => prev + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.225 1.227A7.5 7.5 0 0 1 10.5 8a7.5 7.5 0 0 1-4.275 6.773 7 7 0 1 0 0-13.546M4.187.966a8 8 0 1 1 7.627 14.069A8 8 0 0 1 4.186.964z" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}
        {page === 2 && (
          <div className="content flex flex-col items-center justify-center h-full max-w-[1000px] mx-auto gap-4 text-white p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3 }}
            >
              <p>
                A través de una mezcla de astrología, folklore y un toque de
                imaginación, hemos creado un portal al pasado, permitiéndote
                conectar con tu bestia interior. Tu fecha de nacimiento es la
                clave para entender más sobre tus rasgos inherentes, fortalezas
                y quizás, incluso tu espíritu indomable.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, delay: 3 }}
            >
              <button onClick={() => setPage((prev) => prev + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.225 1.227A7.5 7.5 0 0 1 10.5 8a7.5 7.5 0 0 1-4.275 6.773 7 7 0 1 0 0-13.546M4.187.966a8 8 0 1 1 7.627 14.069A8 8 0 0 1 4.186.964z" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}
        {page === 3 && (
          <div className="content flex flex-col items-center justify-center h-full max-w-[1000px] mx-auto gap-4 text-white p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3 }}
            >
              <p>
                Entonces, ¿estás listo para conocer a tu contraparte animal y
                descubrir lo que revela sobre tu carácter, tus desafíos y tus
                fortalezas únicas? Entra en esta aventura con nosotros y revela
                el espíritu animal que ha estado contigo a través de las vidas.
                Tu viaje de descubrimiento comienza ahora.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, delay: 3 }}
            >
              <button onClick={() => setPage((prev) => prev + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.225 1.227A7.5 7.5 0 0 1 10.5 8a7.5 7.5 0 0 1-4.275 6.773 7 7 0 1 0 0-13.546M4.187.966a8 8 0 1 1 7.627 14.069A8 8 0 0 1 4.186.964z" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}
        {page === 4 && (
          <div className="content flex flex-col items-center justify-center h-full max-w-[1000px] mx-auto gap-4 text-white p-10">
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3 }}
              >
                <h3 className="text-center my-4 font-bold text-4xl">
                  Tu Alter-Ego ha sido revelado
                </h3>
                <div className="image w-full max-w-[600px] h-[200px] md:h-[350px] bg-white rounded-lg mx-auto mb-4">
                  <a href={imageUrl} target="_blank">
                    <img
                      src={imageUrl}
                      alt="Animal"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </a>
                </div>
                <div className="description text-center">
                  <p>{description}</p>
                </div>
              </motion.div>
            )}
            {!success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3 }}
              >
                {!loading && (
                  <>
                    <h3 className="text-center my-4 font-bold text-xl">
                      Ingresa tu fecha de nacimiento
                    </h3>
                    <div className="flex text-center border-4 border-white rounded-full">
                      <input
                        className="w-full p-4 bg-transparent font-bold text-white text-lg border-r-4 border-white"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <select
                        className="w-[80px] text-center p-4 bg-transparent font-bold text-white text-lg border-r-4 border-white"
                        name="day"
                        onChange={handleDayChange}
                        defaultValue={""}
                      >
                        <option value="" disabled>
                          Día
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                      </select>
                      <select
                        className="w-[100px] text-center p-4 bg-transparent font-bold text-white text-lg"
                        name="month"
                        onChange={handleMonthChange}
                        defaultValue={""}
                      >
                        <option value="" disabled>
                          Mes
                        </option>
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">MAyo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                      </select>
                      <select
                        className="w-[80px] text-center p-4 bg-transparent font-bold text-white text-lg border-l-4 border-white"
                        name="year"
                        onChange={handleYearChange}
                        defaultValue={""}
                      >
                        <option value="" disabled>
                          Año
                        </option>
                        <option value="1970">1970</option>
                        <option value="1971">1971</option>
                        <option value="1972">1972</option>
                        <option value="1973">1973</option>
                        <option value="1974">1974</option>
                        <option value="1975">1975</option>
                        <option value="1976">1976</option>
                        <option value="1977">1977</option>
                        <option value="1978">1978</option>
                        <option value="1979">1979</option>
                        <option value="1980">1980</option>
                        <option value="1981">1981</option>
                        <option value="1982">1982</option>
                        <option value="1983">1983</option>
                        <option value="1984">1984</option>
                        <option value="1985">1985</option>
                        <option value="1986">1986</option>
                        <option value="1987">1987</option>
                        <option value="1988">1988</option>
                        <option value="1989">1989</option>
                        <option value="1990">1990</option>
                        <option value="1991">1991</option>
                        <option value="1992">1992</option>
                        <option value="1993">1993</option>
                        <option value="1994">1994</option>
                        <option value="1995">1995</option>
                        <option value="1996">1996</option>
                        <option value="1997">1997</option>
                        <option value="1998">1998</option>
                        <option value="1999">1999</option>
                        <option value="2000">2000</option>
                        <option value="2001">2001</option>
                        <option value="2002">2002</option>
                        <option value="2003">2003</option>
                        <option value="2004">2004</option>
                        <option value="2005">2005</option>
                        <option value="2006">2006</option>
                        <option value="2007">2007</option>
                        <option value="2008">2008</option>
                        <option value="2009">2009</option>
                        <option value="2010">2010</option>
                        <option value="2011">2011</option>
                        <option value="2012">2012</option>
                      </select>
                    </div>
                    {error && (
                      <p className="text-center text-red-500 text-sm font-bold my-4">
                        Por favor, completa todos los campos
                      </p>
                    )}
                  </>
                )}
                <div className="flex flex-col items-center justify-center gap-4 my-4">
                  <button
                    onClick={handleSubmit}
                    className={`bg-white text-black py-2 px-8 rounded-full font-bold text-sm ${
                      enableSubmit
                        ? "cursor-pointer hover:bg-black hover:text-white"
                        : "cursor-not-allowed bg-gray-600 text-gray-500"
                    }`}
                    disabled={!enableSubmit || loading}
                  >
                    {loading
                      ? "Generating, don't close or refresh the page..."
                      : "Discover"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
