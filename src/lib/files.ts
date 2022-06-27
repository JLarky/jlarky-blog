import { formatISO } from 'date-fns'
import { stat } from 'fs'
import { join } from 'path'

const pagesDirectory = join(process.cwd(), 'src/pages')

export async function getFileLastModified(fileName: string) {
  const fullPath = join(pagesDirectory, fileName)
  return new Promise<string>((resolve, reject) => {
    stat(fullPath, function (err, stats) {
      if (err) {
        reject(err)
      } else {
        const mtime = stats.mtime
        resolve(formatISO(mtime))
      }
    })
  })
}
