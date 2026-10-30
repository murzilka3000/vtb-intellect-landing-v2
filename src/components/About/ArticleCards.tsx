"use client";

import { useEffect, useRef } from "react";
import { ARTICLE_AI_URL, ARTICLE_URL } from "@/data/strategies";
import styles from "./About.module.scss";

const SHRINK = 0.035;

export default function ArticleCards() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(list.children) as HTMLElement[];
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!mobile.matches || reduced.matches) {
        cards.forEach((card) => card.style.removeProperty("--scale"));
        return;
      }
      const cover = cards.map((card, i) => {
        if (i === 0) return 0;
        const range = cards[i - 1].offsetHeight || 1;
        const stuckAt = parseFloat(getComputedStyle(card).top) || 0;
        const distance = card.getBoundingClientRect().top - stuckAt;
        return Math.min(1, Math.max(0, 1 - distance / range));
      });
      cards.forEach((card, i) => {
        const covered = cover
          .slice(i + 1)
          .reduce((sum, value) => sum + value, 0);
        card.style.setProperty("--scale", String(1 - SHRINK * covered));
      });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={listRef} className={styles.articles}>
      <div
        className={styles.article}
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <div className={styles.articleBody}>
          <p className={styles.articleTitle}>
            Разбираем, как сервис «Интеллект»
            <br />
            от&nbsp;«ВТБ Мои Инвестиции» помогает инвесторам управлять портфелем
          </p>
          <a
            href={ARTICLE_URL}
            className={styles.articleButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            Читать статью
          </a>
        </div>
        <div className={styles.articleArt} aria-hidden="true">
          <img
            src="/images/article/banner.png"
            alt=""
            className={styles.articleImg}
          />
        </div>
      </div>

      <div
        className={`${styles.article} ${styles.articleAi}`}
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <div className={styles.articleBody}>
          <p className={styles.articleTitle}>
            От&nbsp;первых вложений до&nbsp;соревнований с&nbsp;ИИ&nbsp;— как
            подобрать стратегию <br className={styles.articleAiBreak} />
            под себя с&nbsp;сервисом «Интеллект»{" "}
            <br className={styles.articleAiBreak} />
            от&nbsp;ВТБ Мои Инвестиции
          </p>
          <a
            href={ARTICLE_AI_URL}
            className={styles.articleButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            Читать статью
          </a>
        </div>
        <div className={styles.articleArt} aria-hidden="true">
          <img
            src="/images/article/banner-ai.png"
            alt=""
            className={styles.articleImg}
          />
        </div>
      </div>
    </div>
  );
}
