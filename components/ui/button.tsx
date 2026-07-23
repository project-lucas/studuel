'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { press } from "@/lib/sounds"
import { intentOfVariant, type ButtonVariant } from "@/lib/press"

const buttonVariants = cva(
  // Pilule nette, socle 3D (`.btn-chunky` + `--btn-edge` dans globals.css) et
  // enfoncement au tap : le bouton se comporte comme un objet physique, pas
  // comme une zone cliquable.
  "btn-chunky group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Cibles tactiles : default ≈40px, lg ≈44px (recommandation WCAG/Apple
        // pour une app utilisée au doigt). xs/sm réservés aux usages en ligne.
        default:
          "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  shine = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /**
     * Balayage de lumière permanent. À réserver à l'action UNIQUE et principale
     * d'un écran (le « GO » d'un mode, le CTA d'une modale) : deux boutons qui
     * brillent en même temps ne se distinguent plus l'un de l'autre.
     */
    shine?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  // Le retour sonore/haptique se joue au CLICK, pas au pointerdown.
  //
  // Le pointerdown paraît plus vif — mais un son ne se rattrape pas : poser le
  // pouce sur un bouton puis faire glisser pour dérouler la page (le geste le
  // plus courant du mobile, et l'app est pleine de boutons dans le flux) tirait
  // le son ET la vibration alors qu'aucun clic n'aurait lieu. Un bouton qui
  // sonne quand on scrolle est bien pire qu'un bouton qui sonne 80 ms plus tard.
  //
  // Le click a deux autres mérites : il part aussi à l'ENTRÉE/ESPACE et sous
  // lecteur d'écran (le pointerdown, jamais — ces élèves n'avaient aucun
  // retour), et l'enfoncement VISUEL reste instantané puisqu'il est en CSS pur
  // (`.btn-chunky:active`). C'est le comportement des boutons natifs.
  //
  // `press()` respecte l'interrupteur de son de l'app et se tait tout seul là
  // où l'haptique n'existe pas (iOS Safari, bureau).
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    press(intentOfVariant((variant ?? undefined) as ButtonVariant | undefined))
    onClick?.(e)
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }), shine && "btn-shine")}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
