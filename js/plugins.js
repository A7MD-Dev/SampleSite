// Params
let mainSliderSelector = '.main-slider',
    interleaveOffset = 0.5;

// Main Slider
let mainSliderOptions = {
      loop: true,
      speed:1000,
      autoplay:{
        delay:6000
      },
      pagination: {
        el: '.swiper-pagination',
      },
      loopAdditionalSlides: 10,
      grabCursor: true,
      watchSlidesProgress: true,
      on: {
        init: function(){
          this.autoplay.stop();
        },
        imagesReady: function(){
          this.el.classList.remove('loading');
          this.autoplay.start();
        },
        slideChangeTransitionEnd: function(){
          let swiper = this,
              captions = swiper.el.querySelectorAll('.caption');
          for (let i = 0; i < captions.length; ++i) {
            captions[i].classList.remove('show');
          }
          swiper.slides[swiper.activeIndex].querySelector('.caption').classList.add('show');
        },
        progress: function(){
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            let slideProgress = swiper.slides[i].progress,
                innerOffset = swiper.width * interleaveOffset,
                innerTranslate = slideProgress * innerOffset;
           
            swiper.slides[i].querySelector(".slide-bgimg").style.transform =
              "translateX(" + innerTranslate + "px)";
          }
        },
        touchStart: function() {
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        },
        setTransition: function(speed) {
          let swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = speed + "ms";
            swiper.slides[i].querySelector(".slide-bgimg").style.transition =
              speed + "ms";
          }
        }
      }
    };
let mainSlider = new Swiper(mainSliderSelector, mainSliderOptions);


// Checking button status ( wether or not next/previous and
// submit should be displayed )
const checkButtons = (activeStep, stepsCount) => {
  const prevBtn = $("#wizard-prev");
  const nextBtn = $("#wizard-next");
  const submBtn = $("#wizard-subm");

  switch (activeStep / stepsCount) {
    case 0: // First Step
      prevBtn.hide();
      submBtn.hide();
      nextBtn.show();
      break;
    case 1: // Last Step
      nextBtn.hide();
      prevBtn.show();
      submBtn.show();
      break;
    default:
      submBtn.hide();
      prevBtn.show();
      nextBtn.show();
  }
};

// Scrolling the form to the middle of the screen if the form
// is taller than the viewHeight
const scrollWindow = (activeStepHeight, viewHeight) => {
  if (viewHeight < activeStepHeight) {
    $(window).scrollTop($(steps[activeStep]).offset().top - viewHeight / 2);
  }
};

// Setting the wizard body height, this is needed because
// the steps inside of the body have position: absolute
const setWizardHeight = activeStepHeight => {
  $(".wizard-body").height(activeStepHeight);
};

$(function() {
  // Form step counter (little cirecles at the top of the form)
  const wizardSteps = $(".wizard-header .wizard-step");
  // Form steps (actual steps)
  const steps = $(".wizard-body .step");
  // Number of steps (counting from 0)
  const stepsCount = steps.length - 1;
  // Screen Height
  const viewHeight = $(window).height();
  // Current step being shown (counting from 0)
  let activeStep = 0;
  // Height of the current step
  let activeStepHeight = $(steps[activeStep]).height();

  checkButtons(activeStep, stepsCount);
  setWizardHeight(activeStepHeight);
  
  // Resizing wizard body when the viewport changes
  $(window).resize(function() {
    setWizardHeight($(steps[activeStep]).height());
  });

  // Previous button handler
  $("#wizard-prev").click(() => {
    // Sliding out current step
    $(steps[activeStep]).removeClass("active");
    $(wizardSteps[activeStep]).removeClass("active");

    activeStep--;
    
    // Sliding in previous Step
    $(steps[activeStep]).removeClass("off").addClass("active");
    $(wizardSteps[activeStep]).addClass("active");

    activeStepHeight = $(steps[activeStep]).height();
    setWizardHeight(activeStepHeight);
    checkButtons(activeStep, stepsCount);
  });

  // Next button handler
  $("#wizard-next").click(() => {
    // Sliding out current step
    $(steps[activeStep]).removeClass("inital").addClass("off").removeClass("active");
    $(wizardSteps[activeStep]).removeClass("active");

    // Next step
    activeStep++;
    
    // Sliding in next step
    $(steps[activeStep]).addClass("active");
    $(wizardSteps[activeStep]).addClass("active");

    activeStepHeight = $(steps[activeStep]).height();
    setWizardHeight(activeStepHeight);
    checkButtons(activeStep, stepsCount);
  });
});
