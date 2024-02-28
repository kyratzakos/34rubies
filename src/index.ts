import csv from 'csv-parser';
import fs from 'fs';
import * as readLine from 'readline/promises';
// import * as readLine from 'readline';

const results: Story[] = [];
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
})

interface Story {
  message: string
  optionA: string
  optionB: string | undefined
  optionC: string | undefined
  pathA: string
  pathB: string | undefined
  pathC: string | undefined
}

function printStory(story: Story) {
  console.log(story.message.replaceAll(/\\n/g, '\n'))
  console.log(`A: ${story.optionA}`)
  if (story.optionB) {
    console.log(`B: ${story.optionB}`)
  }
  if (story.optionC) {
    console.log(`C: ${story.optionC}`)
  }
}

export async function getValidInput(story: Story): Promise<string | undefined> {
  try {

    const answer = await rl.question('Enter your choice: ')

    if (answer === 'A') {
      console.log(story.pathA)
      return story.pathA

    } else if (story.pathB && answer === 'B') {
      console.log(story.pathB)
      return story.pathB

    } else if (story.pathC && answer === 'C') {
      console.log(story.pathC)
      return story.pathC

    } else {
      console.log('Invalid input. Choose between A, B or C.')
      getValidInput(story)
    }

  } catch (error) {
    console.log('Error occured')
    console.log(error)
  }
  return
}

async function handleStoryTelling(storyArray: Story[]) {
  printStory(storyArray[0])
  let userInput = await getValidInput(storyArray[0])
  while (userInput) {
    const nextStory = storyArray[Number(userInput) - 1]

    printStory(nextStory)
    userInput = await getValidInput(nextStory)
  }
}

async function main() {
  let storyArray: Story[] = []

  fs.createReadStream('./story.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      storyArray = results.filter((story) => {
        return story.message
      })

      handleStoryTelling(storyArray)

    });

}

setTimeout(() => {
  main()
}, 3000)
