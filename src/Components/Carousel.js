import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import logo1 from "../about_pictures/01.jpg"
import logo2 from "../about_pictures/02.jpg"
import logo3 from "../about_pictures/03.jpg"
import logo4 from "../about_pictures/04.jpg"
import logo5 from "../about_pictures/05.jpg"
import logo6 from "../about_pictures/06.jpg"
import logo7 from "../about_pictures/07.jpg"
import logo8 from "../about_pictures/08.jpg"
import logo9 from "../about_pictures/09.jpg"
import logo10 from "../about_pictures/10.jpg"
import logo11 from "../about_pictures/11.jpg"
import logo12 from "../about_pictures/12.jpg"
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const tutorialSteps = [
    {
      label: '01',
      imgPath:logo1,
    },
    {
      label: '02',
      imgPath:logo2
    },
    {
      label: '03',
      imgPath:logo3,
    },
    {
      label: '04',
      imgPath:logo4,
    },
    {
      label: '05',
      imgPath:logo5,
    },
    {
      label: '06',
      imgPath:logo6,
    },
    {
      label: '07',
      imgPath:logo7,
    },
    {
      label: '08',
      imgPath:logo8,
    },
    {
      label: '09',
      imgPath:logo9,
    },
    {
      label: '10',
      imgPath:logo10,
    },
    {
      label: '11',
      imgPath:logo11,
    },
    {
      label: '12',
      imgPath:logo12,
    },
  ];
  const useStyle = makeStyles({
    root: {
      maxWidth: '85%',
      flexGrow: 1,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      justifyContent:'center',
      backgroundColor: '#222831'
    },
    img: {
      height: '100%',
      display: 'block',
      maxWidth: '100%',
      overflow: 'hidden',
      width: '100%',
    },
  });

function Carousel() {
    const classes = useStyle();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <AutoPlaySwipeableViews
        axis='x'
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        autoplay={false}
      >
        {tutorialSteps.map((step, index) => (
          <div key={step.label} className="image-div">
            {Math.abs(activeStep - index) <= 2 ? (
              <img className={classes.img} src={step.imgPath} alt={step.label} />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
           <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
}

export default Carousel
