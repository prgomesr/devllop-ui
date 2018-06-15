import {Component, OnInit, TemplateRef} from '@angular/core';
import {Categoria} from '../../../core/model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ErrorHandlerService} from '../../../core/error-handler-service';
import {ToastyService} from 'ng2-toasty';
import {CategoriaService} from './categoria-service';
import {FormControl} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categorias = [
    {id: 1, descricao: 'Material de escritório'}
  ];
  id: number;
  modalRef: BsModalRef;
  categoria = new Categoria();
  constructor(private categoriaService: CategoriaService,
              private modalService: BsModalService,
              private errorHandler: ErrorHandlerService,
              private toasty: ToastyService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.spinner.show();
    this.categoriaService.list().subscribe(dados => {
      this.spinner.hide();
      this.categorias = dados;
      },
      error1 => {
        this.spinner.hide();
        this.errorHandler.handle(error1);
      });
  }

  getById(id: number) {
    this.spinner.show();
    this.categoriaService.read(id).subscribe(dado => {
        this.spinner.hide();
        this.categoria = dado;
      },
      error1 => {
        this.spinner.hide();
        this.errorHandler.handle(error1);
      });
  }

  openFormModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    if (id) {
      this.getById(id);
    } else {
      this.categoria = new Categoria();
    }
  }

  onSubmit(form) {
    if (this.editando) {
      this.updateModel(form);
    } else {
      this.createModel(form);
    }
  }

  createModel(form: FormControl) {
    this.spinner.show();
    this.categoriaService.create(this.categoria).subscribe(() => {
        this.spinner.hide();
        this.toasty.success({title: 'Parabéns!', msg: 'Categoria cadastrada com sucesso.'});
        form.reset();
        this.getAll();
        this.modalRef.hide();
      },
      err => {
        this.spinner.hide();
        this.errorHandler.handle(err);
      });
  }

  updateModel(form: FormControl) {
    this.spinner.show();
    this.categoriaService.update(this.categoria).subscribe(() => {
        this.spinner.hide();
        this.toasty.success({title: 'Parabéns!', msg: 'Categoria atualizada com sucesso.'});
        form.reset();
        this.getAll();
        this.modalRef.hide();
      }
      , error1 => {
        this.spinner.hide();
        this.errorHandler.handle(error1);
      });
  }

  delete(id: number) {
    this.categoriaService.delete(id).subscribe(() => {
        this.toasty.success({title: 'Parabéns!', msg: 'Categoria excluída com sucesso.'});
        this.getAll();
      }
      , error1 => this.errorHandler.handle(error1));
  }

  openConfirmModal(template: TemplateRef<any>, id: number) {
    this.id = id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(id: number) {
    id = this.id;
    this.delete(id);
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

  get editando(): any {
    return Boolean (this.categoria.id);
  }

}
