import { Pipe, PipeTransform } from '@angular/core';

/**
 * Finds an object from given source using the given key - value pairs
 */
@Pipe({
  name      : 'invoiceStatus',
  pure      : false,
  standalone: true,
})
export class invoiceStatusPipe implements PipeTransform
{
  /**
   * Constructor
   */
  constructor()
  {
  }

  /**
   * Transform
   *
   * @param value A string or an array of strings to find from source
   * @param key Key of the object property to look for
   * @param source Array of objects to find from
   */
  transform(value: string | string[], arg?: any): any
  {
    if(value === 'paid') {
      if(arg && arg === 'bg') {
        return 'bg-green-500'
      }
      if(arg && arg === 'bg-light') {
        return 'bg-green-100 dark:bg-green-100/10'

      }
      if(arg && arg === 'text-color') {
        return 'text-green-500'
      }
      if(arg && arg === 'text') {
        return 'Paid'
      }
    }

    if(value === 'pending') {
      if(arg && arg === 'bg') {
        return 'bg-orange-500'
      }
      if(arg && arg === 'bg-light') {
        return 'bg-orange-100 dark:bg-orange-100/10'

      }
      if(arg && arg === 'text-color') {
        return 'text-orange-500'
      }
      if(arg && arg === 'text') {
        return 'Pending'
      }
    }

    if(value === 'draft') {
      if(arg && arg === 'bg') {
        return 'bg-gray-500'
      }

      if(arg && arg === 'bg-light') {
        return 'bg-gray-100 dark:bg-gray-100/10'
      }

      if(arg && arg === 'text-color') {
        return 'text-gray-500 dark:text-white'
      }

      if(arg && arg === 'text') {
        return 'Draft'
      }
    }
    // If the value is a string...
    return
  }
}
