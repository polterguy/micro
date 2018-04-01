## Extension widgets - PayPal button

This widget allows you to accept payments through PayPal. It creates a PayPal button, which once clicked will use the
PayPal API to create a window which allows the user to pay for something, or donate for that matter. When the process
has been successfully confirmed, it will invoke your **[.onok]** lambda callback, allowing you to handle successful
transactions, any ways you want.

```hyperlambda-snippet
/*
 * Creates a page with a PayPal button widget in it.
 */
create-widget
  class:container
  oninit

    /*
     * Including Micro CSS file.
     */
    micro.css.include

    /*
     * Including PayPal script.
     *
     * Notice, if you want to use the PayPal button, you will have
     * to make sure you invoke this event during the initial pageload
     * of your request - Otherwise the button won't work.
     */
    micro.widgets.paypal-button.ensure-checkout-js

  widgets
    div
      class:row
      widgets
        div
          class:col
          widgets
            h1
              innerValue:PayPal widget - Donate example

            /*
             * Our actualy PayPal button.
             */
            micro.widgets.paypal-button
              price:5
              custom:Donate
              .onok

                /*
                 * Displaying some info to user.
                 */
                micro.windows.info:Thank you for sponsoring me with a coffee
```

**Notice**, if you want to use the PayPal button, it is _crucial_ that you invoke **[micro.widgets.paypal-button.ensure-checkout-js]**
during the initial pageload of your page. This is a restriction in PayPal's servers, that only allows you to include
their JavaScript API file during the initial loading of your page.

The PayPal button widget can be given the following arguments.

* __[price]__ - Amount
* __[currency]__ - Optional, what currency the transaction will be performed in. Defaults to _"EUR"_, implying EUROs
* __[custom]__ - Optional, custom piece of text associate with your transaction
* __[paypal.production]__ - Optional, your production PayPal API key. Important, change this one, otherwise all money goes to me
* __[paypal.sandbox]__ - Optional, your sandbox PayPal API key. Useful for testing your process
* __[paypal.type]__ - Optional, type of transaction (_"sandbox"_ or _"production"_) - Defaults to production. Set this to _"sandbox"_ to test your process
