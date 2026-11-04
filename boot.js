/**
 * Host row of the Sci-Fi Boot bundle.
 *
 * Injects the pre-paint boot sequence into every served index response, so the
 * animation is the very first frame the browser paints — before the shell, its
 * stylesheets or any React code exist in the page.
 */
import { ROWS } from './splash.js'

export const name = 'scifi-boot'

/** The index renderer lives on the Web server service. */
export const inject = ['webServer']

/**
 * Append this package's index rows to each response. Rows are rendered fresh
 * per request, so a reload always gets the current sequence.
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  ctx.on('webserver/index-inject', (table) => {
    table.push(...ROWS)
  })
}
