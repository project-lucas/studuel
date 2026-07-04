'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CircleCheck, CircleX, RotateCcw, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/types'

// Session de quiz : une question à la fois, correction immédiate, score final.
export default function QuizPlayer({
  title,
  questions,
}: {
  title: string
  questions: QuizQuestion[]
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answered = selected !== null

  const choose = (optionIndex: number) => {
    if (answered) return
    setSelected(optionIndex)
    if (optionIndex === question.correct_index) setScore((s) => s + 1)
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
    }
  }

  const restart = () => {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const ratio = score / questions.length
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Quiz terminé !</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-bold">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {ratio === 1
              ? 'Parfait, tu maîtrises ce chapitre ! 🎉'
              : ratio >= 0.5
                ? 'Bien joué — encore quelques révisions et c’est acquis.'
                : 'Continue de t’entraîner, tu vas progresser !'}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={restart}>
            <RotateCcw className="size-4" /> Recommencer
          </Button>
          <Button variant="outline" asChild>
            <Link href="/test">
              <ArrowLeft className="size-4" /> Retour aux tests
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardDescription>
          Question {index + 1} / {questions.length}
          {question.kind === 'true_false' ? ' — Vrai ou Faux' : ' — QCM'}
        </CardDescription>
        <CardTitle className="text-lg">{question.question}</CardTitle>
        {/* Barre de progression */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correct_index
          const isSelected = i === selected
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={answered}
              className={cn(
                'flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors',
                !answered && 'hover:bg-accent hover:text-accent-foreground',
                answered && isCorrect && 'border-green-600 bg-green-600/10 text-green-700 dark:text-green-400',
                answered && isSelected && !isCorrect && 'border-destructive bg-destructive/10 text-destructive',
                answered && !isSelected && !isCorrect && 'opacity-50',
              )}
            >
              {option}
              {answered && isCorrect ? <CircleCheck className="size-4 shrink-0" /> : null}
              {answered && isSelected && !isCorrect ? <CircleX className="size-4 shrink-0" /> : null}
            </button>
          )
        })}

        {answered && question.explanation ? (
          <p className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
            {question.explanation}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="justify-end">
        <Button onClick={next} disabled={!answered}>
          {index + 1 >= questions.length ? 'Voir le score' : 'Question suivante'}
        </Button>
      </CardFooter>
    </Card>
  )
}
