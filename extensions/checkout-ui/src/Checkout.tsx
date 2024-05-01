import {
  Icon,
  InlineStack,
  Link,
  Text,
  useShop,
  reactExtension,
  Form,
  Button,
  TextField,
  View,
  InlineLayout,
  useApplyGiftCardChange,
  useAppliedGiftCards,
  useApplyDiscountCodeChange,
  useDiscountCodes
} from '@shopify/ui-extensions-react/checkout';

import { useEffect, useState } from 'react';

export const extension = reactExtension(
  'purchase.checkout.reductions.render-before',
  () => <Extension />,
);

export const Footer = reactExtension(
  'purchase.checkout.footer.render-after',
  () => <CustomFooter />,
);

function Extension() {
  const applyAttributeChange = useApplyGiftCardChange();
  const giftCardCode = useAppliedGiftCards();
  const applyDiscountCode = useApplyDiscountCodeChange();
  const discountCode = useDiscountCodes();
  const [hasGiftCard, setHasGiftCard] = useState('');
  const [statusError, setStatusError] = useState('');

  async function onCheckboxChange(code: string) {
    try {
      const result = await applyAttributeChange({
        code: code,
        type: 'addGiftCard',
      });
      if (result.type === 'success') {
        setHasGiftCard('');
        setStatusError('');
      } else if (result.type === 'error'){
        setStatusError('Enter a valid gift card');
      }
    } catch (error) {
      console.error('Error applying gift card:', error);
    }
  }
useEffect(() => {
  if (discountCode.length > 0 && hasGiftCard.length > 0){
    console.log('Gift card code is too long', hasGiftCard);
    applyDiscountCode({
      code: hasGiftCard,
      type: 'removeDiscountCode',
    });
    setTimeout(() => {
      setStatusError('Enter a valid gift card');
    }, 500);
  }
},[discountCode.length]);

  return (
    <>
      <Form onSubmit={() => onCheckboxChange(hasGiftCard)} id="formGift">
        <InlineLayout columns={['81.5%', '10%']}>
        
          <TextField name='giftcard' label="Gift card code" value={hasGiftCard} onChange={setHasGiftCard} error={statusError} />
          <View borderRadius="none" padding={['none', 'none', 'none', 'base']}>
            <Button accessibilityRole='submit'>Apply</Button>
          </View> 
        </InlineLayout>
      </Form>
    </>
  );
}

function CustomFooter() {
  const {storefrontUrl} = useShop();

  return (
    <InlineLayout
      blockAlignment="center"
      columns={["auto", "fill"]}
      accessibilityRole="navigation"
    >
      <InlineStack
        spacing="extraTight"
        blockAlignment="center"
        accessibilityRole="orderedList"
      >
        <InlineStack
          accessibilityRole="listItem"
          blockAlignment="center"
          spacing="extraTight"
        >
          <Link to={storefrontUrl}>Home</Link>
          <Icon source="chevronRight" size="extraSmall" />
        </InlineStack>
        <InlineStack
          accessibilityRole="listItem"
          blockAlignment="center"
          spacing="extraTight"
        >
          <Link to={new URL("/collections", storefrontUrl).href}>Shop</Link>
          <Icon source="chevronRight" size="extraSmall" />
        </InlineStack>
        <InlineStack accessibilityRole="listItem">
          <Text appearance="subdued">Checkout</Text>
        </InlineStack>
      </InlineStack>

      <InlineStack
        spacing="tight"
        inlineAlignment="end"
        accessibilityRole="orderedList"
      >
        <View accessibilityRole="listItem">
          <Link to={new URL("/sizing", storefrontUrl).href}>Sizing</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/terms", storefrontUrl).href}>Terms</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/privacy", storefrontUrl).href}>Privacy</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/faq", storefrontUrl).href}>FAQ</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/accessibility", storefrontUrl).href}>
            Accessibility
          </Link>
        </View>
      </InlineStack>
    </InlineLayout>
  );
}


